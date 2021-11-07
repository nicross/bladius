content.deck = (() => {
  let deck = [],
    discard = 0

  return {
    add: function (...cards) {
      for (const card of cards) {
        deck.push({
          ...card,
          uuid: engine.utility.uuid(),
        })
      }

      return this
    },
    draw: function (count = 1) {
      const picks = []

      count = Math.min(count, deck.length)

      for (let i = 0; i < count; i += 1) {
        const pick = this.pick()
        picks.push(pick)
      }

      return picks
    },
    drawValidHand: function (hand = content.component.hand.create()) {
      let cards = this.draw(3),
        validation = hand.validate(cards)

      while (validation.filter((result) => !result).length) {
        cards = cards.filter((card, index) => validation[index])
        cards = cards.concat(this.draw(3 - cards.length))
        validation = content.hero.hand.validate(cards)
      }

      return cards
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
