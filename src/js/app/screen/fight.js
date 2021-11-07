app.screen.fight = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-fight')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-fight', onEnter)
    app.state.screen.on('exit-fight', onExit)
  })

  function onEnter() {
    app.utility.focus.setWithin(root)
    engine.loop.on('frame', onFrame)

    // Simulate game
    if (Math.random() > 0) {
      app.state.screen.dispatch('win', {
        kills: Math.round(engine.utility.lerpRandom([1, 1], [1, 3], Math.min(1, content.round.get() / 16))),
      })
    } else {
      app.state.screen.dispatch('loss')
    }

  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    // Controls
    // Win condition
    // Loss condition
  }

  return {}
})()
