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

    const cards = content.packs.redeem()
    content.deck.add(...cards).shuffle()

    const isStarter = cards.length > 3
    content.hero.potions.add(isStarter ? 3 : 1)
    content.hero.gold.add(content.round.get())

    updateCards(cards)
    updateHeader(cards)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const ui = app.controls.ui()

    if (ui.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    if (ui.up || ui.left) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (ui.down || ui.right) {
      return app.utility.focus.setNextFocusable(root)
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

    root.querySelector('.a-booster--subtitle').innerHTML = `Received ${cards.length} Cards + ${app.utility.component.potion(isStarter ? 3 : 1)} + ${app.utility.component.gold(content.round.get())}`
  }

  return {}
})()
