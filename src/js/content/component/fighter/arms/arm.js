content.component.fighter.arms.arm = {}

content.component.fighter.arms.arm.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.arms.arm.prototype = {
  construct: function ({
    arms,
    angle = 0,
    angleOffset = 0,
    length = 0,
    vector,
    vectorOffset,
  } = {}) {
    this.arms = arms

    this.angle = angle
    this.angleOffset = angleOffset
    this.length = length
    this.vector = engine.utility.vector2d.create(vector)
    this.vectorOffset = engine.utility.vector2d.create(vectorOffset)

    return this
  },
  activate: function () {
    if (this.isActive() || this.isCooldown()) {
      return this
    }

    const duration = this.duration(),
      time = engine.loop.time()

    this.timerDirection = 1
    this.timerDuration = duration
    this.timerStart = time
    this.timerEnd = time + duration

    return this
  },
  collisionCircle: function () {
    if (!this.isActive()) {
      return
    }

    return content.utility.circle.create({
      radius: engine.utility.lerp(0, this.length, this.ratio()),
      vector: this.position(),
    })
  },
  compute: function () {
    return this.arms && this.arms.fighter
      ? this.arms.fighter.attributes.compute(this.card ? this.card.attributes : {})
      : {}
  },
  deactivate: function () {
    if (this.isCooldown()) {
      return this
    }

    const time = engine.loop.time()

    const delta = time - this.timerStart,
      duration = Math.min(this.duration(), delta)

    this.timerDirection = -1
    this.timerDuration = duration
    this.timerStart = time
    this.timerEnd = time + duration

    return this
  },
  duration: function () {
    const {attackSpeed} = this.compute()
    return 0.5 * attackSpeed
  },
  equip: function (card = {}) {
    this.card = {...card}
    return this
  },
  isActive: function () {
    if (this.timerDirection != 1) {
      return false
    }

    // Can block indefinitely
    if (this.isDefend()) {
      return true
    }

    return engine.loop.time() <= this.timerEnd
  },
  isAttack: function () {
    return this.card && this.card.action == 'attack'
  },
  isCooldown: function () {
    if (this.timerDirection != -1) {
      return false
    }

    return engine.loop.time() <= this.timerEnd
  },
  isDefend: function () {
    return this.card && this.card.action == 'defend'
  },
  position: function () {
    const isActive = this.isActive(),
      ratio = this.ratio()

    const value = isActive
      ? ratio
      : (1 - ratio) * (this.timerDuration / this.duration())

    const angle = engine.utility.lerp(this.angle + this.angleOffset, this.angle, value)

    return this.vector.add(
      this.vectorOffset.rotate(this.angle)
    ).add(
      engine.utility.vector2d.create({x: this.length}).rotate(angle)
    )
  },
  ratio: function () {
    const delta = engine.loop.time() - this.timerStart
    return engine.utility.clamp(delta / this.timerDuration, 0, 1)
  },
  reset: function () {
    delete this.card
    delete this.timerDirection
    delete this.timerDuration
    delete this.timerEnd
    delete this.timerStart

    return this
  },
  update: function ({
    angle = 0,
    vector,
  }) {
    this.angle = angle
    this.vector = engine.utility.vector2d.create(vector)

    // Force deactivation when active timer is out
    if (this.timerDirection == 1 && !this.isActive()) {
      this.deactivate()
    }

    return this
  },
}
