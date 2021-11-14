content.component.fighter.body = {}

content.component.fighter.body.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.body.prototype = {
  construct: function ({
    angle = 0,
    vector,
  } = {}) {
    this.angle = angle
    this.vector = engine.utility.vector2d.create(vector)

    this.angularVelocity = 0
    this.lateralVelocity = engine.utility.vector2d.create()

    return this
  },
  collisionCircle: function () {
    return content.utility.circle.create({
      radius: this.radius,
      vector: this.vector,
    })
  },
  intersectsPoint: function (point = {}) {
    return this.vector.distance(point) <= this.radius
  },
  intersectsFighter: function (fighter = {}) {
    return this.vector.distance(fighter.body.vector) <= this.radius + fighter.body.radius
  },
  intersectsSphere: function (point, radius = 0) {
    return this.vector.distance(point) <= this.radius + radius
  },
  radius: 1/3,
  relativeTo: function (point = {}) {
    return this.vector.subtract(point).rotate(this.angle)
  },
  update: function () {
    const delta = engine.loop.delta()

    this.angle += this.angularVelocity * delta

    this.vector = this.vector.add(
      this.lateralVelocity.scale(delta)
    )

    return this
  },
}
