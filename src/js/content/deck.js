content.deck = (() => {
  let deck = [],
    discard = 0

  return {
    add: function (...cards) {
      for (const card of cards) {
        deck.push(card)
      }

      return this
    },
    draw: function (count = 1) {
      const picks = []

      count = Math.min(count, deck.length)

      for (const i = 0; i < count; i += 1) {
        const pick = this.pick()
        picks.push(pick)
      }

      return picks
    },
    get: () => [...deck],
    length: () => deck.length,
    pick: function () {
      if (!deck.length) {
        return
      }

      if (!discard) {
        this.shuffle()
      }

      const card = deck.shift()

      deck.push(card)
      discard -= 1

      return card
    },
    reset: function () {
      deck.length = 0
      discard = 0

      return this
    },
    shuffle: function () {
      deck = engine.utility.shuffle(deck)
      discard = deck.length

      return this
    }
  }
})()

engine.state.on('reset', () => content.deck.reset())
