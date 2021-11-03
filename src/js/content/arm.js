content.arm = {}

content.arm.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.arm.prototype = {
  construct: function ({
    angle = 0,
  } = {}) {
    this.angle = angle

    return this
  },
  activate: function () {
    if (this.isActive()) {
      return this
    }

    if (this.card) {
      // TODO: Get or inject speed
      const speed = 1
      const duration = this.card.duration * speed

      this.card.activate(this)
      this.cooldown = duration + engine.loop.time()
    }

    return this
  },
  equip: function (card = {}) {
    this.card = card
    return this
  },
  isActive: function () {
    return this.cooldown
      ? this.cooldown > engine.loop.time()
      : false
  },
  reset: function () {
    delete this.card
    delete this.cooldown

    return this
  },
}
