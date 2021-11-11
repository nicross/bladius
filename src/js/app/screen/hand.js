app.screen.hand = (() => {
  let redrawButton,
    root

  engine.ready(() => {
    root = document.querySelector('.a-hand')
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
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    drawHand(e.previousState == 'booster')
    redrawButton.setAttribute('aria-disabled', !content.hero.gold.has(1) ? 'true' : 'false')
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

    if (ui.left || ui.right) {
      const leftRight = {
        '.c-cards': '.c-card',
        '.c-screen--actions': '.c-screen--action *',
      }

      for (const [parent, target] of Object.entries(leftRight)) {
        if (app.utility.focus.isWithin(root.querySelector(parent))) {
          if (ui.left) {
            return app.utility.focus.setPreviousFocusable(root, (element) => {
              return element.matches(target)
            })
          }

          if (ui.right) {
            return app.utility.focus.setNextFocusable(root, (element) => {
              return element.matches(target)
            })
          }
        }
      }
    }

    if (ui.up) {
      return app.utility.focus.setPreviousFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) *')
      })
    }

    if (ui.down) {
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
    redrawButton.setAttribute('aria-disabled', !content.hero.gold.has(1) ? 'true' : 'false')
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
