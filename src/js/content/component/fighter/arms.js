content.component.fighter.arms = {}

content.component.fighter.arms.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.fighter.arms.prototype = {
  construct: function (fighter) {
    this.fighter = fighter

    this.left = content.component.fighter.arms.arm.create({
      arms: this,
      angleOffset: Math.PI/2,
      length: 1, // attacks can hit 2m ahead
      vectorOffset: {y: 1/3},
    })

    this.right = content.component.fighter.arms.arm.create({
      arms: this,
      angleOffset: -Math.PI/2,
      length: 1, // attacks can hit 2m ahead
      vectorOffset: {y: -1/3},
    })

    return this
  },
  activateLeftArm: function () {
    if (this.canActivateLeftArm()) {
      this.left.activate()
    }

    return this
  },
  activateRightArm: function () {
    if (this.canActivateRightArm()) {
      this.right.activate()
    }

    return this
  },
  canActivateLeftArm: function () {
    return !this.isActive() && !this.left.isCooldown() && !this.fighter.movement.isDodging()
  },
  canActivateRightArm: function () {
    return !this.isActive() && !this.right.isCooldown() && !this.fighter.movement.isDodging()
  },
  canDeactivateLeftArm: function () {
    return this.left.isActive()
  },
  canDeactivateRightArm: function () {
    return this.right.isActive()
  },
  deactivate: function () {
    return this.deactivateLeftArm().deactivateRightArm()
  },
  deactivateLeftArm: function () {
    if (this.canDeactivateLeftArm()) {
      this.left.deactivate()
    }

    return this
  },
  deactivateRightArm: function () {
    if (this.canDeactivateRightArm()) {
      this.right.deactivate()
    }

    return this
  },
  getActive: function () {
    if (this.left.isActive()) {
      return this.left
    }

    if (this.right.isActive()) {
      return this.right
    }
  },
  getActiveCollisionCircle: function () {
    const active = this.getActive()

    if (active) {
      return active.collisionCircle()
    }
  },
  isActive: function () {
    // For allowing only one arm active at a time
    return this.left.isActive() || this.right.isActive()
  },
  isAttackActive: function () {
    // For AI to inspect player attack status
    return (this.left.isAttack() && this.left.isActive())
      || (this.right.isAttack() && this.right.isActive())
  },
  isAttackCooldown: function () {
    // For AI to inspect player attack status
    return (this.left.isAttack() && this.left.isCooldown())
      || (this.right.isAttack() && this.right.isCooldown())
  },
  isDefendActive: function () {
    // For AI to inspect player defend status
    return (this.left.isDefend() && this.left.isActive())
      || (this.right.isDefend() && this.right.isActive())
  },
  isDefendCooldown: function () {
    // For AI to inspect player defend status
    return (this.left.isDefend() && this.left.isCooldown())
      || (this.right.isDefend() && this.right.isCooldown())
  },
  reset: function () {
    this.left.reset()
    this.right.reset()

    return this
  },
  update: function (...args) {
    if (this.fighter.movement.isDodging()) {
      this.deactivate()
    }

    this.left.update(...args)
    this.right.update(...args)

    return this
  },
}
