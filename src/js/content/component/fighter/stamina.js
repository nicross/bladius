content.component.fighter.stamina = {}

content.component.fighter.stamina.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.stamina.prototype = {
  construct: function () {
    this.max = 0
    this.regeneration = 0
    this.value = 0

    return this
  },
  getRatio: function () {
    return this.max
      ? this.value / this.max
      : 0
  },
  has: function (value = 0) {
    return this.value >= value
  },
  isZero: function () {
    return this.value == 0
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
  setRegeneration: function (regeneration) {
    this.regeneration = Math.max(0, regeneration)

    return this
  },
  subtract: function (value = 0) {
    this.value = Math.max(0, this.value - value)
    this.wasSubtracted = true

    return this
  },
  update: function () {
    const delta = engine.loop.delta()

    // Prevent regen if in active use, e.g. sprinting
    if (!this.wasSubtracted) {
      this.value += this.regeneration * delta
      this.value = Math.min(this.value, this.max)
    }

    this.wasSubtracted = false

    return this
  },
}
