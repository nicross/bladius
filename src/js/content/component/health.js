content.component.health = {}

content.component.health.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.health.prototype = {
  construct: function () {
    engine.utility.pubsub.decorate(this)

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
  subtract: function (value = 0) {
    if (!this.value) {
      return this
    }

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

    // TODO: Potion heals

    return this
  },
}
