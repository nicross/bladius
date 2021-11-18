app.controls.gamepad = {
  continuous: function () {
    const {digital} = engine.input.gamepad.get()
    const state = {}

    let rotate = 0,
      x = 0,
      y = 0

    if (engine.input.gamepad.hasAxis(0, 1, 2)) {
      rotate = engine.input.gamepad.getAxis(2, true)
      x = engine.input.gamepad.getAxis(0)
      y = engine.input.gamepad.getAxis(1, true)
    } else if (engine.input.gamepad.hasAxis(0, 1)) {
      rotate = engine.input.gamepad.getAxis(0, true)
      y = engine.input.gamepad.getAxis(1, true)
    }

    if (digital[12]) {
      y = 1
    }

    if (digital[13]) {
      y = -1
    }

    if (digital[14]) {
      rotate = 1
    }

    if (digital[15]) {
      rotate = -1
    }

    if (rotate) {
      state.rotate = engine.utility.clamp(rotate, -1, 1)
    }

    if (x) {
      state.x = engine.utility.clamp(x, -1, 1)
    }

    if (y) {
      state.y = engine.utility.clamp(y, -1, 1)
    }

    if (digital[6]) {
      state.leftArm = true
    }

    if (digital[7]) {
      state.rightArm = true
    }

    if (digital[10]) {
      state.sprint = true
    }

    return state
  },
  discrete: function () {
    const {digital} = engine.input.gamepad.get()
    const state = {}

    let x = engine.input.gamepad.getAxis(0),
      y = engine.input.gamepad.getAxis(1, true)

    if (digital[12]) {
      y = 1
    }

    if (digital[13]) {
      y = -1
    }

    if (digital[14]) {
      x = -1
    }

    if (digital[15]) {
      x = 1
    }

    const absX = Math.abs(x),
      absY = Math.abs(y)

    if (absX - absY >= 0.125) {
      if (x < 0) {
        state.left = true
      } else {
        state.right = true
      }
    } else if (absY - absX >= 0.125) {
      if (y < 0) {
        state.down = true
      } else {
        state.up = true
      }
    }

    if (digital[0]) {
      state.confirm = true
      state.dodge = true
    }

    if (digital[1]) {
      state.cancel = true
      state.potion = true
    }

    if (digital[4] && !digital[5]) {
      state.targetPrevious = true
    }

    if (digital[5] && !digital[4]) {
      state.targetNext = true
    }

    if (digital[8]) {
      state.select = true
    }

    if (digital[9]) {
      state.start = true
    }

    return state
  },
}
