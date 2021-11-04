content.experience = (() => {
  let experience = 0

  return {
    get: () => experience,
    increment: function (value = 1) {
      experience += value
      return this
    },
    reset: function () {
      experience = 0

      return this
    },
  }
})()

engine.state.on('reset', () => content.experience.reset())
