content.packs = (() => {
  let nextRedeem = 1

  function calculateNextRedeem() {
    let result = 4

    while (result <= nextRedeem) {
      result *= 2
    }

    return result
  }

  return {
    canRedeem: () => content.round.get() >= nextRedeem,
    getNextRedeem: () => nextRedeem,
    getNextRedeemDelta: () => Math.max(nextRedeem - content.round.get(), 0),
    redeem: function () {
      if (!this.canRedeem()) {
        return []
      }

      nextRedeem = calculateNextRedeem()

      return content.round.get() == 1
        ? content.cards.generateStarterPack()
        : content.cards.generateBoosterPack()
    },
    reset: function () {
      nextRedeem = 1
      return this
    },
  }
})()

engine.state.on('reset', () => content.packs.reset())
