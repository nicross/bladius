app.screen.splash = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-splash')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-splash', onEnter)
    app.state.screen.on('exit-splash', onExit)

    root.querySelector('.a-splash--start').addEventListener('click', onStartClick)
    root.querySelector('.a-splash--version').innerHTML = `v${app.version()}`
  })

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const ui = app.controls.ui()

    if (ui.start || (app.utility.focus.is(root) && (ui.confirm || ui.enter || ui.space))) {
      onStartClick()
    }

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

  function onStartClick() {
    app.state.screen.dispatch('start')
  }

  return {}
})()
