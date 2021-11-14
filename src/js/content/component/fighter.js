content.component.fighter = {}

content.component.fighter.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.prototype = {
  construct: function ({
    attributes = {},
    body = {},
    hand = [],
  } = {}) {
    engine.utility.pubsub.decorate(this)

    this.arms = content.component.arm.create()
    this.body = content.component.body.create(body)
    this.attributes = content.component.attributes.create(attributes)
    this.hand = content.component.hand.create()
    this.health = content.component.health.create()
    this.stamina = content.component.stamina.create()

    this.setHand(hand)

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

    const {
      health,
      stamina,
      staminaRegen,
    } = this.attributes.compute()

    this.health.setMax(health)
    this.stamina.setMax(stamina)
    this.stamina.setRegeneration(staminaRegen)

    return this
  },
  update: function (...args) {
    this.body.update(...args)
    this.health.update(...args)
    this.stamina.update(...args)

    return this
  },
}
