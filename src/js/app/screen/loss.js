app.screen.loss = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-loss')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-loss', onEnter)
    app.state.screen.on('exit-loss', onExit)

    root.querySelector('.a-loss--next').addEventListener('click', onNextClick)
  })

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    updateSubtitle()
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const discrete = app.controls.discrete()

    if (discrete.start || (app.utility.focus.is(root) && (discrete.confirm || discrete.enter || discrete.space))) {
      onNextClick()
    }

    if (discrete.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    if (discrete.up || discrete.left) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (discrete.down || discrete.right) {
      return app.utility.focus.setNextFocusable(root)
    }
  }

  function onNextClick() {
    engine.state.reset()
    app.state.screen.dispatch('restart')
  }

  function updateSubtitle() {
    // XXX: Incremented at start of each round
    const rounds = content.round.get() - 1
    root.querySelector('.a-loss--subtitle').innerHTML = `Survived ${rounds} ${rounds == 1 ? 'Round' : 'Rounds'}`
  }

  return {}
})()
