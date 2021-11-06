content.component.arm = {}

content.component.arm.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.arm.prototype = {
  construct: function ({
    quaternion,
    quaternionOffset,
    vector,
    vectorOffset,
  } = {}) {
    this.quaternion = engine.utility.quaternion.create(quaternion)
    this.quaternionOffset = engine.utility.quaternion.create(quaternionOffset)
    this.vector = engine.utility.vector3d.create(vector)
    this.vectorOffset = engine.utility.vector3d.create(vectorOffset)

    return this
  },
  activate: function ({
    speed = 1,
  } = {}) {
    if (this.isActive() || this.isCooldown()) {
      return this
    }

    // XXX: Flat duration of 0.5s
    const duration = 0.5 * speed,
      time = engine.loop.time()

    this.timerDirection = 1
    this.timerDuration = duration
    this.timerStart = time
    this.timerEnd = time + duration

    return this
  },
  deactivate: function ({
    speed = 1,
  } = {}) {
    if (!this.isActive()) {
      return this
    }

    // XXX: Flat duration of 0.5s (or active delta, whatever is shortest)
    const time = engine.loop.time()

    const delta = time - this.timerStart,
      duration = Math.min(0.5 * speed, delta)

    this.timerDirection = -1
    this.timerDuration = duration
    this.timerStart = time
    this.timerEnd = time + duration

    return this
  },
  detectCollision: function ({
    center,
    radius = 0,
  } = {}) {
    if (!this.isActive()) {
      return false
    }

    const ratio = this.getRatio()

    const quaternion = this.quaternion
      .multiply(this.quaternionOffset)
      .lerpTo(this.quaternion, ratio)

    const vector = this.vectorOffset
      .rotateQuaternion(this.quaternion)
      .add(this.vector)

    if (this.isAttack()) {
      // TODO: Check attack geometry, cone
    }

    if (this.isDefend()) {
      // TODO: Check defense geometry, plane
    }

    return false
  },
  equip: function (card = {}) {
    this.card = {...card}
    return this
  },
  getRatio: function () {
    const delta = engine.loop.time() - this.timerStart
    return engine.utility.clamp(delta / this.timerDuration, 0, 1)
  },
  isActive: function () {
    if (this.timerDirection != 1) {
      return false
    }

    if (this.isDefend()) {
      return true
    }

    return this.timerEnd >= engine.loop.time()
  },
  isAttack: function () {
    return this.card && this.card.action == 'attack'
  },
  isCooldown: function () {
    if (this.timerDirection != -1) {
      return false
    }

    return this.timerEnd >= engine.loop.time()
  },
  isDefend: function () {
    return this.card && this.card.action == 'defend'
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
    quaternion,
    vector,
  }) {
    if (quaternion) {
      this.quaternion = engine.utility.quaternion.create(quaternion)
    }

    if (vector) {
      this.vector = engine.utility.vector3d.create(vector)
    }

    return this
  },
}
