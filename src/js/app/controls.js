app.controls = (() => {
  const continuousDefaults = {
    rotate: 0,
    x: 0,
    y: 0,
  }

  let discreteCache = {},
    discreteDelta = {}

  let continuousCache = {...continuousDefaults}

  function updateGame() {
    continuousCache = {
      ...continuousDefaults,
      ...app.controls.gamepad.continuous(),
      ...app.controls.mouse.continuous(),
      ...app.controls.keyboard.continuous(),
    }
  }

  function updateUi() {
    const values = {
      ...app.controls.gamepad.discrete(),
      ...app.controls.mouse.discrete(),
      ...app.controls.keyboard.discrete(),
    }

    discreteDelta = {}

    for (const key in values) {
      if (!discreteCache[key]) {
        discreteDelta[key] = values[key]
      }
    }

    discreteCache = values
  }

  return {
    continuous: () => ({...continuousCache}),
    discrete: () => ({...discreteDelta}),
    reset: function () {
      continuousCache = {}
      discreteCache = {}
      discreteDelta = {}
      return this
    },
    update: function () {
      updateGame()
      updateUi()
      return this
    },
  }
})()

engine.loop.on('frame', () => app.controls.update())
