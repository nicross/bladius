app.screen.fight = (() => {
  const pauseDelay = 1.5 * 1000

  let isPaused = false,
    potions,
    root

  engine.ready(() => {
    root = document.querySelector('.a-fight')
    potions = root.querySelector('.a-fight--potions')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-fight', onEnter)
    app.state.screen.on('exit-fight', onExit)
  })

  function checkLoss() {
    return content.hero.health.isZero()
  }

  function checkWin() {
    if (content.enemies.queue().length) {
      return false
    }

    const enemies = content.enemies.get()

    for (const enemy of enemies) {
      if (!enemy.health.isZero()) {
        return false
      }
    }

    return true
  }

  function onEnter() {
    isPaused = false

    app.utility.focus.setWithin(root)
    engine.loop.on('frame', onFrame)

    content.audio.unduck()
    content.enemies.generate()

    //
    potions.removeAttribute('aria-live')
    updatePotions()
    potions.setAttribute('aria-live', 'assertive')

    // Start breath/heart if not started, e.g. on new game
    content.audio.breathing.start()
    content.audio.heartbeat.start()
  }

  function onExit() {
    engine.loop.off('frame', onFrame)

    content.audio.duck()
    content.enemies.reset()
  }

  function onFrame() {
    if (isPaused) {
      return
    }

    const continuous = app.controls.continuous(),
      discrete = app.controls.discrete()

    // Handle win conditions
    if (checkWin()) {
      // XXX: Reset movement to prevent footsteps between matches
      content.hero.movement.reset()

      // Dramatic pause
      isPaused = true

      return setTimeout(() => app.state.screen.dispatch('win', {
        kills: content.enemies.get().length,
      }), pauseDelay)
    }

    // Handle loss conditions
    if (checkLoss()) {
      // Kill breath/heart
      content.audio.breathing.stop()
      content.audio.heartbeat.stop()

      // Dramatic pause
      isPaused = true

      return setTimeout(() => app.state.screen.dispatch('loss'), pauseDelay)
    }

    if (discrete.potion && content.potions.canUse()) {
      content.potions.use()
      updatePotions()
    }

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

  function updatePotions() {
    const value = content.potions.get()

    potions.innerHTML = app.utility.component.potion(value)

    if (value) {
      potions.removeAttribute('aria-disabled')
    } else {
      potions.setAttribute('aria-disabled', 'true')
    }
  }

  return {}
})()
