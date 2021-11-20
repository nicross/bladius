content.component.deck = {}

content.component.deck.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.deck.prototype = {
  construct: function () {
    engine.utility.pubsub.decorate(this)
    
    this.cards = []
    this.discard = 0

    return this
  },
  add: function (...cards) {
    for (const card of cards) {
      this.cards.push({
        ...card,
        uuid: engine.utility.uuid(),
      })
    }

    return this
  },
  destroy: function () {
    this.off()

    return this
  },
  draw: function (count = 1) {
    const picks = []

    count = Math.min(count, this.cards.length)

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
  get: () => [...this.cards],
  length: () => this.cards.length,
  pick: function () {
    if (!this.cards.length) {
      return
    }

    if (!this.discard) {
      this.shuffle()
      pubsub.emit('shuffle')
    }

    const card = this.cards.shift()

    this.cards.push(card)
    this.discard -= 1

    return card
  },
  reset: function () {
    this.cards.length = 0
    this.discard = 0

    return this
  },
  shuffle: function () {
    this.cards = engine.utility.shuffle(this.cards)
    this.discard = this.cards.length

    return this
  },
}
