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

    this.arms = content.component.fighter.arms.create(this)
    this.attributes = content.component.attributes.create(attributes)
    this.body = content.component.fighter.body.create(body)
    this.footsteps = content.component.fighter.footsteps.create({vector: body.vector})
    this.movement = content.component.fighter.movement.create(this)
    this.hand = content.component.hand.create()
    this.health = content.component.fighter.health.create()
    this.stamina = content.component.fighter.stamina.create()

    this.setHand(hand)

    // Forward events
    this.health.on('kill', () => this.emit('kill', this))
    this.footsteps.on('step', () => this.emit('step', this))
    this.movement.on('dodge', () => this.emit('dodge', this))

    return this
  },
  destroy: function () {
    this.emit('destroy')

    this.footsteps.destroy()
    this.health.destroy()
    this.off()

    return this
  },
  reset: function () {
    this.arms.reset()
    this.attributes.reset()
    this.footsteps.reset()
    this.hand.reset()

    return this
  },
  setHand: function (...args) {
    this.hand.set(...args)
    this.attributes.setWithHand(this.hand)

    this.arms.right.equip(this.hand.primary)
    this.arms.left.equip(this.hand.secondary)

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
    if (this.health.isZero()) {
      return this
    }

    this.health.update(...args)
    this.stamina.update(...args)

    this.movement.update(...args)
    this.body.update(...args)

    this.arms.update({
      angle: this.body.angle,
      vector: this.body.vector,
    })

    this.footsteps.update({
      isDodging: this.movement.isDodging(),
      vector: this.body.vector,
      velocity: this.body.lateralVelocity,
    })

    return this
  },
}
