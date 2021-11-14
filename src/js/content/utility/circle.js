content.utility.circle = {}

content.utility.circle.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.utility.circle.prototype = {
  construct: function ({
    radius = 0,
    vector,
  } = {}) {
    this.radius = radius
    this.vector = engine.utility.vector2d.create(vector)

    return this
  },
  intersectsCircle: function ({
    radius = 0,
    vector,
  } = {}) {
    return this.vector.distance(vector) <= this.radius + radius
  },
  intersectsPoint: function (vector) {
    return this.vector.distance(vector) <= this.radius
  },
  set: function ({
    radius = 0,
    vector,
  } = {}) {
    this.radius = radius
    this.vector = engine.utility.vector2d.create(vector)

    return this
  },
}
