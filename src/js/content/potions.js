content.potions = (() => {
  const cost = 1,
    pubsub = engine.utility.pubsub.create()

  let potions = 0

  return engine.utility.pubsub.decorate({
    add: function (value = 0) {
      potions += value
      return this
    },
    buy: function () {
      if (!this.canBuy()) {
        return this
      }

      potions += 1

      return this
    },
    canBuy: () => content.gold.has(cost),
    canUse: () => potions > 0,
    get: () => potions,
    reset: function () {
      potions = 0
      return this
    },
    use: function () {
      if (!this.canUse()) {
        return this
      }

      potions -= 1
      this.emit('use')

      return this
    },
  }, pubsub)
})()

engine.state.on('reset', () => content.potions.reset())
