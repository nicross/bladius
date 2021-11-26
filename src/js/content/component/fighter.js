content.component.fighter = {}

content.component.fighter.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.prototype = {
  construct: function ({
    ai = false,
    attributes = {},
    body = {},
    detune = Math.random(),
    hand = [],
  } = {}) {
    engine.utility.pubsub.decorate(this)

    this.arms = content.component.fighter.arms.create(this)
    this.attributes = content.component.attributes.create(attributes)
    this.body = content.component.fighter.body.create(body)
    this.detune = engine.utility.lerp(0, 666, detune)
    this.footsteps = content.component.fighter.footsteps.create({vector: body.vector})
    this.movement = content.component.fighter.movement.create(this)
    this.hand = content.component.hand.create()
    this.health = content.component.fighter.health.create(this)
    this.stamina = content.component.fighter.stamina.create(this)

    this.setHand(hand)

    if (ai) {
      this.agent = content.component.agent.create({
        fighter: this,
      })
    }

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
    this.body.reset()
    this.footsteps.reset()
    this.hand.reset()
    this.health.reset()
    this.movement.reset()
    this.stamina.reset()

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

    if (this.agent) {
      this.agent.update()
    }

    return this
  },
}
