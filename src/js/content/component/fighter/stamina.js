content.component.fighter.stamina = {}

content.component.fighter.stamina.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.stamina.prototype = {
  construct: function (fighter) {
    this.fighter = fighter

    this.max = 0
    this.value = 0
    this.wasUsed = false

    return this
  },
  getRatio: function () {
    return this.max
      ? this.value / this.max
      : 1
  },
  has: function (value = 0) {
    return this.value >= value
  },
  isZero: function () {
    return this.value == 0
  },
  markUsed: function () {
    this.wasUsed = true
    return this
  },
  reset: function () {
    this.max = 0
    this.value = 0
    this.wasUsed = false

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
    this.value = Math.max(0, this.value - value)
    this.markUsed()

    return this
  },
  update: function () {
    const delta = engine.loop.delta()

    // TODO: Support active effects applied by arm?
    const {staminaRegen} = this.fighter.attributes.compute()

    // Prevent regen if in active use, e.g. sprinting
    if (!this.wasUsed) {
      this.value += staminaRegen * delta
      this.value = Math.min(this.value, this.max)
    }

    this.wasUsed = false

    return this
  },
}
