content.component.health = {}

content.component.health.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.health.prototype = {
  construct: function () {
    this.max = 0
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

    return this
  },
  update: function () {
    const delta = engine.loop.delta()

    // TODO: Potion heals

    return this
  },
}
