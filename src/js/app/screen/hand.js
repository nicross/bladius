app.screen.hand = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-hand')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-hand', onEnter)
    app.state.screen.on('exit-hand', onExit)

    root.querySelector('.a-hand--next').addEventListener('click', onNextClick)
    root.querySelector('.a-hand--redraw').addEventListener('click', onRedrawClick)
  })

  function drawHand() {
    content.hero.hand.set(
      content.deck.drawValidHand(content.hero.hand)
    )

    updateCards()
  }

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    drawHand()
    root.querySelector('.a-hand--redraw').disabled = !content.hero.gold.has(1)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onNextClick() {
    app.state.screen.dispatch('next')
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

  function onRedrawClick() {
    drawHand()

    content.hero.gold.spend(1)
    root.querySelector('.a-hand--redraw').disabled = !content.hero.gold.has(1)
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

  return {}
})()
