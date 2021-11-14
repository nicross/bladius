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
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const continuous = app.controls.continuous(),
      discrete = app.controls.discrete()

    // XXX: Allow skipping of battles, without combat or win/loss conditions
    // TODO: Timer to automatically win?

    if (discrete.enter || discrete.escape || discrete.select || discrete.start) {
      app.state.screen.dispatch('win', {
        kills: Math.round(engine.utility.lerpRandom([1, 1], [1, 3], Math.min(1, content.round.get() / 16))),
      })
    }

    if (content.hero.health.isZero()) {
      app.state.screen.dispatch('loss')
    }

    // Win condition: No alive enemy fighters
    // Controls
  }

  return {}
})()
