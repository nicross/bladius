content.component.fighter = {}

content.component.fighter.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.prototype = {
  construct: function ({
    attributes = {},
    hand = {},
  } = {}) {
    engine.utility.pubsub.decorate(this)

    this.arms = content.component.arm.create()
    this.attributes = content.component.attributes.create(attributes)
    this.hand = content.component.hand.create(hand)

    this.attributes.setWithHand(this.hand)

    return this
  },
  destroy: function () {
    this.off()

    return this
  },
  reset: function () {
    this.attributes.reset()
    this.hand.reset()

    return this
  },
  setHand: function (...args) {
    this.hand.set(...args)
    this.attributes.setWithHand(this.hand)

    return this
  },
}
