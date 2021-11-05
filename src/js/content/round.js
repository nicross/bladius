content.round = (() => {
  let round = 1

  return {
    get: () => round,
    increment: function () {
      round += 1
      return this
    },
    reset: function () {
      round = 1
      return this
    },
  }
})()

engine.state.on('reset', () => content.round.reset())
