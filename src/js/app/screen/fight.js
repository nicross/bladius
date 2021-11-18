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

    content.audio.unduck()
  }

  function onExit() {
    engine.loop.off('frame', onFrame)

    content.audio.duck()
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

    // Loss condition: zero health
    if (content.hero.health.isZero()) {
      app.state.screen.dispatch('loss')
    }

    // TODO: Win condition: No alive enemy fighters

    // TODO: Use potions

    // Arms
    if (continuous.leftArm) {
      content.hero.arms.activateLeft()
    } else {
      content.hero.arms.deactivateLeft()
    }

    if (continuous.rightArm) {
      content.hero.arms.activateRight()
    } else {
      content.hero.arms.deactivateRight()
    }

    // Movement
    const lateral = engine.utility.vector2d.create({
      x: continuous.y,
      y: -continuous.x,
    }).rotate(content.hero.body.angle)

    content.hero.movement.input({
      dodge: discrete.dodge,
      rotate: continuous.rotate,
      sprint: continuous.sprint,
      x: lateral.x,
      y: lateral.y,
    })
  }

  return {}
})()
