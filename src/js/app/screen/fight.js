app.screen.fight = (() => {
  let root

  // TODO: Remove
  let timeout

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
    content.enemies.generate()

    // TODO: Remove
    timeout = engine.loop.time() + 10
  }

  function onExit() {
    engine.loop.off('frame', onFrame)

    content.audio.duck()
    content.enemies.reset()
  }

  function onFrame() {
    const continuous = app.controls.continuous(),
      discrete = app.controls.discrete()

    // XXX: Allow skipping of battles, without combat or win/loss conditions
    // TODO: Remove

    if (discrete.enter || discrete.escape || discrete.select || discrete.start || engine.loop.time() >= timeout) {
      // XXX: Reset movement to prevent footsteps between matches
      content.hero.movement.reset()

      return app.state.screen.dispatch('win', {
        kills: content.enemies.get().length,
      })
    }

    // Loss condition: zero health
    if (content.hero.health.isZero()) {
      app.state.screen.dispatch('loss')
    }

    // TODO: Win condition: No alive enemy fighters

    // TODO: Use potions

    // Arms
    if (continuous.rightArm) {
      content.hero.arms.activateRight()
    } else {
      content.hero.arms.deactivateRight()
    }

    if (continuous.leftArm) {
      content.hero.arms.activateLeft()
    } else {
      content.hero.arms.deactivateLeft()
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
