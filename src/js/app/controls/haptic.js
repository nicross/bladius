app.controls.haptic = (() => {
  const defaultEffect = {
    duration: 0,
    startDelay: 0,
    strongMagnitude: 0,
    weakMagnitude: 0,
  }

  function getActuators() {
    const actuators = [],
      gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
      if (!gamepad) {
        continue
      }

      if (gamepad.vibrationActuator && gamepad.vibrationActuator.type == 'dual-rumble') {
        actuators.push(gamepad.vibrationActuator)
      }
    }

    return actuators
  }

  function isActive() {
    return true
  }

  function trigger(effect) {
    const actuators = getActuators()

    effect = {...defaultEffect, ...effect}

    for (const actuator of actuators) {
      if (actuator.playEffect && actuator.type) {
        actuator.playEffect(actuator.type, effect)
      }
    }
  }

  return {
    getActuators,
    isActive,
    trigger: function (...args) {
      if (isActive()) {
        trigger(...args)
      }

      return this
    },
  }
})()

content.collisions.on('attack', ({
  from,
  to,
} = {}) => {
  const isHero = to === content.isHero,
    velocity = from.arms.getActive().ratio()

  app.controls.haptic.trigger({
    duration: isHero ? 750 : 375,
    strongMagnitude: isHero ? velocity : 0,
    weakMagnitude: isHero ? 0 : velocity,
  })
})

content.collisions.on('block', ({
  from,
  to,
} = {}) => {
  const isHero = to === content.isHero,
    velocity = from.arms.getActive().ratio()

  app.controls.haptic.trigger({
    duration: isHero ? 750 : 375,
    strongMagnitude: velocity * (isHero ? 0.75 : 0.25),
    weakMagnitude: velocity * (isHero ? 0.25 : 0.75),
  })
})

content.collisions.on('parry', ({
  from,
  to,
} = {}) => {
  const velocity = Math.min(1, from.arms.getActive().ratio() + to.arms.getActive().ratio())

  app.controls.haptic.trigger({
    duration: 500,
    strongMagnitude: velocity/2,
    weakMagnitude: velocity/2,
  })
})

content.hero.on('step', () => {
  app.controls.haptic.trigger({
    duration: 125,
    strongMagnitude: 0,
    weakMagnitude: engine.utility.clamp(content.hero.body.lateralVelocity.distance() / 5 / 4, 0, 1),
  })
})
