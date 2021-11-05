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
    canRedeem: (round = 0) => round >= nextRedeem,
    getNextRedeem: () => nextRedeem,
    getNextRedeemDelta: (round = 0) => Math.max(nextRedeem - round, 0),
    redeem: (round = 0) => {
      if (!this.canRedeem()) {
        return
      }

      nextRedeem = calculateNextRedeem()

      return round == 1
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
