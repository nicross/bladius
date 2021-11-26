content.component.fighter.health = {}

content.component.fighter.health.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.health.prototype = {
  construct: function (fighter) {
    this.fighter = fighter

    engine.utility.pubsub.decorate(this)

    this.healing = 0
    this.max = 0
    this.value = 0

    return this
  },
  destroy: function () {
    this.off()

    return this
  },
  getRatio: function () {
    return this.max
      ? this.value / this.max
      : 1
  },
  has: function (value = 0) {
    return (this.value + this.healing) >= value
  },
  heal: function (value = 0) {
    this.healing = value

    return this
  },
  isZero: function () {
    return this.value == 0
  },
  reset: function () {
    this.healing = 0
    this.max = 0
    this.value = 0

    return this
  },
  setMax: function (max = 0) {
    max = Math.max(0, max)

    // Rescale current value, fill to max if previously unset
    this.value = this.max
      ? Math.ceil(engine.utility.scale(this.value, 0, this.max, 0, max))
      : max

    this.max = max

    return this
  },
  subtract: function (value = 0) {
    if (!this.value) {
      return this
    }

    // Absorb healing
    const healingReduction = Math.min(this.healing, value)
    this.healing = Math.max(0, this.healing - healingReduction)
    value = Math.max(0, value - healingReduction)

    // Apply damage
    this.value = Math.max(0, this.value - value)

    if (!this.value) {
      this.emit('kill')
    }

    return this
  },
  update: function () {
    if (!this.value) {
      return this
    }

    const delta = engine.loop.delta()

    // Apply healing
    if (this.healing) {
      const {healing} = this.fighter.attributes.compute()
      const healingAmount = Math.min(delta * healing, this.healing)
      this.healing = Math.max(0, this.healing - healingAmount)
      this.value = Math.min(this.value + healingAmount, this.max)
    }

    return this
  },
}
