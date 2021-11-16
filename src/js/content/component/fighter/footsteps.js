content.component.fighter.footsteps = {}

content.component.fighter.footsteps.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.footsteps.prototype = {
  construct: function ({
    length = 1,
    vector = {},
  } = {}) {
    engine.utility.pubsub.decorate(this)

    this.length = length
    this.isLeft = Math.random() > 0.5
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
    this.isLeft = Math.random() > 0.5
    this.vector = engine.utility.vector3d.create(vector)

    return this
  },
  update: function ({
    isDodging = false,
    vector = {},
  } = {}) {
    const distance = this.vector.distance(vector),
      shouldTrigger = distance >= (isDodging ? this.length/2 : this.length)

    if (shouldTrigger) {
      this.pubsub.emit('step', this)
      this.isLeft = !this.isLeft
      this.vector = engine.utility.vector3d.create(vector)
    }

    return this
  },
}
