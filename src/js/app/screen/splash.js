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
    const discrete = app.controls.discrete()

    if (discrete.start || (app.utility.focus.is(root) && (discrete.confirm || discrete.enter || discrete.space))) {
      onStartClick()
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

  function onStartClick() {
    app.state.screen.dispatch('start')
  }

  return {}
})()
