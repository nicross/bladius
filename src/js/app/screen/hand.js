app.screen.hand = (() => {
  let goldElement,
    potionsElement,
    redrawButton,
    root

  engine.ready(() => {
    root = document.querySelector('.a-hand')
    goldElement = root.querySelector('.a-hand--gold')
    potionsElement = root.querySelector('.a-hand--potions')
    redrawButton = root.querySelector('.a-hand--redraw')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-hand', onEnter)
    app.state.screen.on('exit-hand', onExit)

    root.querySelector('.a-hand--next').addEventListener('click', onNextClick)
    redrawButton.addEventListener('click', onRedrawClick)
  })

  function drawHand(isShuffle = false) {
    if (!isShuffle) {
      content.deck.once('shuffle', () => isShuffle = true)
    }

    const cards = content.deck.drawValidHand(content.hero.hand)

    content.hero.hand.set(cards)
    content.hero.attributes.setWithHand(content.hero.hand)

    updateCards()

    if (isShuffle) {
      content.audio.sfx.shuffle()
    } else {
      content.audio.sfx.draw()
    }
  }

  function onEnter(e) {
    drawHand(e.previousState == 'booster')

    goldElement.removeAttribute('aria-live')
    updateGold()
    goldElement.setAttribute('aria-live', 'assertive')

    updatePotions()

    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onNextClick() {
    app.state.screen.dispatch('next')
  }

  function onFrame() {
    const discrete = app.controls.discrete()

    if (discrete.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    if (discrete.left || discrete.right) {
      const leftRight = {
        '.c-cards': '.c-card',
        '.c-screen--actions': '.c-screen--action *',
      }

      for (const [parent, target] of Object.entries(leftRight)) {
        if (app.utility.focus.isWithin(root.querySelector(parent))) {
          if (discrete.left) {
            return app.utility.focus.setPreviousFocusable(root, (element) => {
              return element.matches(target)
            })
          }

          if (discrete.right) {
            return app.utility.focus.setNextFocusable(root, (element) => {
              return element.matches(target)
            })
          }
        }
      }
    }

    if (discrete.up) {
      return app.utility.focus.setPreviousFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) *')
      })
    }

    if (discrete.down) {
      return app.utility.focus.setNextFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) *')
      })
    }
  }

  function onRedrawClick() {
    if (redrawButton.getAttribute('aria-disabled') == 'true') {
      return
    }

    drawHand()

    content.hero.gold.spend(1)
    updateGold()
  }

  function updateCards() {
    const cards = content.hero.hand.sort(),
      parent = root.querySelector('.a-hand--cards')

    parent.innerHTML = ''

    // Build components
    for (const card of cards) {
      const container = document.createElement('li')
      container.className = 'c-cards--card'

      app.component.card.create({
        card,
      }).attach(container)

      parent.appendChild(container)
    }
  }

  function updateGold() {
    // Gold
    goldElement.innerHTML = app.utility.component.gold(content.hero.gold.get())

    // Redraw button
    redrawButton.setAttribute('aria-disabled', !content.hero.gold.has(1) ? 'true' : 'false')
  }

  function updatePotions() {
    potionsElement.innerHTML = app.utility.component.potion(content.hero.potions.get())
  }

  return {}
})()
