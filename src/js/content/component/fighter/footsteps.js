content.component.fighter.footsteps = {}

content.component.fighter.footsteps.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.footsteps.prototype = {
  construct: function ({
    length = 0.5,
    vector = {},
  } = {}) {
    engine.utility.pubsub.decorate(this)

    this.length = length
    this.vector = engine.utility.vector3d.create(vector)

    return this
  },
  destroy: function () {
    this.off()

    return this
  },
  reset: function ({
    vector = {},
  } = {}) {
    this.vector = engine.utility.vector3d.create(vector)
    return this
  },
  update: function (vector = {}) {
    const distance = this.vector.distance(vector),
      shouldTrigger = distance >= this.length

    if (shouldTrigger) {
      this.pubsub.emit('step')
      this.vector = engine.utility.vector3d.create(vector)
    }

    return this
  },
}
