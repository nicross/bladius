app.screen.booster = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-booster')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-booster', onEnter)
    app.state.screen.on('exit-booster', onExit)
  })

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    const cards = content.packs.redeem()
    content.deck.add(...cards)

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

  function updateCards(pack) {
    const parent = root.querySelector('.a-booster--cards')

    parent.innerHTML = ''

    for (const card of pack) {
      const container = document.createElement('li')
      container.className = 'a-booster--card'

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

    root.querySelector('.a-booster--subtitle').innerHTML = `Received ${cards.length} Cards`
  }

  return {}
})()
