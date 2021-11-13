app.controls.mouse = (() => {
  const sensitivity = 100

  let fightScreen,
    rotate = 0

  engine.ready(() => {
    fightScreen = document.querySelector('.a-fight')
    fightScreen.addEventListener('click', onClick)

    app.state.screen.on('exit-fight', onExitGame)
    app.state.screen.on('enter-fight', onEnterGame)
  })

  function exitPointerLock() {
    document.exitPointerLock()
  }

  function isPointerLock() {
    return document.pointerLockElement === fightScreen
  }

  function onClick() {
    if (!isPointerLock()) {
      requestPointerLock()
    }
  }

  function onEnterGame() {
    if (app.isElectron()) {
      requestPointerLock()
    }
  }

  function onExitGame() {
    if (isPointerLock()) {
      exitPointerLock()
    }

    rotate = 0
  }

  function requestPointerLock() {
    fightScreen.requestPointerLock()
  }

  return {
    continuous: function () {
      if (!isPointerLock()) {
        return {}
      }

      const mouse = engine.input.mouse.get(),
        state = {}

      if (mouse.button[0] && !mouse.button[2]) {
        state.leftArm = true
      }

      if (mouse.button[2] && !mouse.button[0]) {
        state.rightArm = true
      }

      if (mouse.moveX) {
        // Accelerate and clamp rotation
        rotate += engine.utility.scale(mouse.moveX, -window.innerWidth, window.innerWidth, 1, -1) * sensitivity
        rotate = engine.utility.clamp(rotate, -1, 1)
      }

      if (rotate) {
        // Apply and decelerate rotation to zero
        state.rotate = rotate
        rotate = content.utility.accelerate.value(rotate, 0, 32)
      }

      return state
    },
    discrete: function () {
      const mouse = engine.input.mouse.get(),
        state = {}

      if (mouse.button[3]) {
        state.heal = true
      }

      if (mouse.button[4]) {
        state.dodge = true
      }

      if (mouse.wheelY > 0) {
        state.targetNext = true
      } else if (mouse.wheelY < 0) {
        state.targetPrevious = true
      }

      return state
    },
  }
})()
