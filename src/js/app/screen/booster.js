app.screen.booster = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-booster')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-booster', onEnter)
    app.state.screen.on('exit-booster', onExit)

    root.querySelector('.a-booster--next').addEventListener('click', onNextClick)
  })

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    const cards = content.packs.redeem(),
      gold = content.round.get(),
      isStarter = cards.length > 3,
      potions = isStarter ? 3 : 1

    content.deck.add(...cards).shuffle()
    content.potions.add(potions)
    content.gold.add(gold)
    content.audio.sfx.coins(gold)

    updateCards(cards)
    updateHeader(cards)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const discrete = app.controls.discrete()

    if (discrete.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    // Left and right to cycle cards
    if (app.utility.focus.isWithin(root.querySelector('.c-cards'))) {
      if (discrete.left) {
        return app.utility.focus.setPreviousFocusable(root, (element) => {
          return element.matches('.c-card')
        })
      }

      if (discrete.right) {
        return app.utility.focus.setNextFocusable(root, (element) => {
          return element.matches('.c-card')
        })
      }
    }

    // Up and down to main landmarks
    if (discrete.up) {
      return app.utility.focus.setPreviousFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) .c-card')
      })
    }

    if (discrete.down) {
      return app.utility.focus.setNextFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) .c-card')
      })
    }
  }

  function onNextClick() {
    app.state.screen.dispatch('next')
  }

  function updateCards(pack) {
    const parent = root.querySelector('.a-booster--cards')
    parent.innerHTML = ''

    pack.sort((a, b) => b.cost - a.cost)

    for (const card of pack) {
      const container = document.createElement('li')
      container.className = 'c-cards--card'

      app.component.card.create({
        card,
      }).attach(container)

      parent.appendChild(container)
    }
  }

  function updateHeader(cards) {
    const isStarter = cards.length > 3

    root.querySelector('.a-booster--title').innerHTML = isStarter
      ? 'Starter Pack'
      : 'Booster Pack'

    root.querySelector('.a-booster--subtitle').innerHTML = `Received ${cards.length} Cards + ${app.utility.component.potion(isStarter ? 3 : 1)} and ${app.utility.component.gold(content.round.get())}`
  }

  return {}
})()
