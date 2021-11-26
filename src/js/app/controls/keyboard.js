app.controls.keyboard = {
  continuous: () => {
    const keys = engine.input.keyboard.get(),
      state = {}

    const leftArm = keys.ControlLeft || keys.AltRight,
      moveBackward = keys.ArrowDown || keys.KeyS || keys.Numpad5,
      moveForward = keys.ArrowUp || keys.KeyW || keys.Numpad8,
      rightArm = keys.ControlRight || keys.AltLeft,
      sprint = keys.ShiftLeft || keys.ShiftRight,
      strafeLeft = keys.KeyA || keys.KeyZ || keys.Numpad4,
      strafeRight = keys.KeyD || keys.KeyX || keys.Numpad6,
      turnLeft = keys.ArrowLeft || keys.KeyQ || keys.Numpad7,
      turnRight = keys.ArrowRight || keys.KeyE || keys.Numpad9

    if (moveBackward && !moveForward) {
      state.y = -1
    } else if (moveForward && !moveBackward) {
      state.y = 1
    }

    if (strafeLeft && !strafeRight) {
      state.x = -1
    } else if (strafeRight && !strafeLeft) {
      state.x = 1
    }

    if (turnLeft && !turnRight) {
      state.rotate = 1
    } else if (turnRight && !turnLeft) {
      state.rotate = -1
    }

    if (leftArm) {
      state.leftArm = true
    }

    if (rightArm) {
      state.rightArm = true
    }

    if (sprint) {
      state.sprint = true
    }

    return state
  },
  discrete: () => {
    const keys = engine.input.keyboard.get(),
      state = {}

    if (keys.Enter || keys.NumpadEnter) {
      state.enter = true
    }

    if (keys.Escape) {
      state.escape = true
    }

    if (keys.Space) {
      state.dodge = true
      state.space = true
    }

    if (keys.ArrowDown || keys.KeyS || keys.Numpad5) {
      state.down = true
    }

    if (keys.ArrowLeft || keys.KeyA || keys.Numpad4) {
      state.left = true
    }

    if (keys.ArrowRight || keys.KeyD || keys.Numpad6) {
      state.right = true
    }

    if (keys.ArrowUp || keys.KeyW || keys.Numpad8) {
      state.up = true
    }

    if (keys.KeyF || keys.KeyZ || keys.Slash) {
      state.potion = true
    }

    if (keys.KeyR || keys.KeyX || keys.Period) {
      state.targetNext = true
    }

    if (keys.KeyT || keys.KeyC || keys.Comma) {
      state.targetPrevious = true
    }

    return state
  },
}
