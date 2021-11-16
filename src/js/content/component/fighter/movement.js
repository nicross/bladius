content.component.fighter.movement = {}

content.component.fighter.movement.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.movement.prototype = {
  construct: function (fighter) {
    engine.utility.pubsub.decorate(this)

    this.fighter = fighter

    this.inputRotation = 0
    this.inputVelocity = engine.utility.vector2d.create()

    return this
  },
  applyDodge: function () {
    if (!this.canDodge()) {
      return this
    }

    const duration = 0.5
    this.dodgeTimer = duration + engine.loop.time()

    // Override input
    this.inputRotation = 0

    this.inputVelocity = this.inputVelocity.isZero()
      ? engine.utility.vector2d.unitX().rotate(this.fighter.body.angle + Math.PI) // backwards, sprinting
      : this.inputVelocity.normalize() // input direction, sprinting

    // Spend stamina
    this.fighter.stamina.subtract(10/3)
    this.emit('dodge')

    return this
  },
  applyInputRotation: function () {
    const acceleration = Math.PI,
      deceleration = Math.PI * 2,
      maxVelocity = Math.PI / 2

    const velocity = this.fighter.body.anglularVelocity

    if (this.inputRotation) {
      this.fighter.body.angularVelocity = content.utility.accelerate.value(
        velocity,
        this.inputRotation * maxVelocity,
        acceleration
      )
    } else {
      this.fighter.body.angularVelocity = content.utility.accelerate.value(
        velocity,
        0,
        deceleration
      )
    }

    return this
  },
  applyInputVelocity: function () {
    const acceleration = 5,
      deceleration = 10,
      maxVelocity = 5

    const currentVelocity = this.fighter.body.lateralVelocity

    if (this.inputVelocity.isZero()) {
      this.fighter.body.lateralVelocity = content.utility.accelerate.vector(
        currentVelocity,
        engine.utility.vector3d.create(),
        deceleration
      )
      return this
    }

    const targetVelocity = this.inputVelocity.scale(maxVelocity)

    const rate = currentVelocity.distance() <= targetVelocity.distance()
      ? acceleration
      : deceleration

    this.fighter.body.lateralVelocity = content.utility.accelerate.vector(
      currentVelocity,
      targetVelocity,
      rate
    )

    return this
  },
  canSprint: function () {
    return this.fighter.stamina.has(10/3 * engine.loop.delta())
  },
  canDodge: function () {
    return !this.isDodging() && this.fighter.stamina.has(10/3)
  },
  destroy: function () {
    this.off()

    return this
  },
  input: function ({
    dodge = false,
    rotate = 0,
    sprint = false,
    x = 0,
    y = 0,
  } = {}) {
    if (this.isDodging()) {
      return this
    }

    if (sprint) {
      // Prevent regen of sprint, even if unable to sprint
      this.fighter.stamina.markUsed()
    }

    sprint = sprint && this.canSprint()

    const distance = engine.utility.distance({x, y}),
      rotateScale = sprint ? 0.5 : 1,
      xScale = sprint ? 1 : 0.5,
      yScale = 0.5

    if (distance > 1) {
      x /= distance
      y /= distance
    }

    this.inputRotation = rotate * rotateScale
    this.inputVelocity = engine.utility.vector2d.create({
      x: x * xScale,
      y: y * yScale,
    })

    if (dodge) {
      this.applyDodge()
    }

    if (sprint) {
      // Spend stamina
      this.fighter.stamina.subtract(10/3 * engine.loop.delta())
    }

    return this
  },
  isDodging: function () {
    return this.dodgeTimer >= engine.loop.time()
  },
  update: function () {
    this.applyInputRotation()
    this.applyInputVelocity()

    return this
  },
}
