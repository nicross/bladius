content.hero.experience = (() => {
  let experience = 0

  return {
    add: function (value = 1) {
      experience += value
      return this
    },
    get: () => experience,
    reset: function () {
      experience = 0
      return this
    },
  }
})()

engine.state.on('reset', () => content.hero.experience.reset())
