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
    return app.settings.computed.gamepadVibration > 0
  }

  function trigger(effect) {
    const actuators = getActuators()

    effect = {...defaultEffect, ...effect}
    effect.strongMagnitude *= app.settings.computed.gamepadVibration
    effect.weakMagnitude *= app.settings.computed.gamepadVibration

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
