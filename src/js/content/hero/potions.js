content.hero.potions = (() => {
  const cost = 1,
    pubsub = engine.utility.pubsub.create(),
    startCount = 3

  let potions = startCount

  return engine.utility.pubsub.decorate({
    buy: function () {
      if (!this.canBuy()) {
        return this
      }

      potions += 1

      return this
    },
    canBuy: () => content.gold.has(cost),
    canUse: () => potions > 0,
    count: () => potions,
    reset: function () {
      potions = startCount
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

engine.state.on('reset', () => content.hero.potions.reset())
