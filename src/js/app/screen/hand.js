app.screen.hand = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-hand')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-hand', onEnter)
    app.state.screen.on('exit-hand', onExit)
  })

  function onEnter() {
    app.utility.focus.setWithin(root)
    engine.loop.on('frame', onFrame)
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

  return {}
})()
