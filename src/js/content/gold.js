content.gold = (() => {
  let gold = 0

  return {
    add: function (value = 0) {
      gold += value
      return this
    },
    get: () => gold,
    has: (value = 1) => gold >= value,
    reset: function () {
      gold = 0

      return this
    },
    spend: function (value = 0) {
      gold -= value
      return this
    },
  }
})()

engine.state.on('reset', () => content.gold.reset())
