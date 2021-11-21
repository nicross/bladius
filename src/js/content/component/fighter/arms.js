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
  activateLeft: function () {
    if (this.canActivateLeft()) {
      this.left.activate()
    }

    return this
  },
  activateRight: function () {
    if (this.canActivateRight()) {
      this.right.activate()
    }

    return this
  },
  attack: function () {
    if (this.right.isAttack() && this.canActivateRight()) {
      return this.activateRight()
    }

    if (this.left.isAttack() && this.canActivateLeft()) {
      return this.activateLeft()
    }

    return this
  },
  canAttack: function () {
    return (this.right.isAttack() && this.canActivateRight())
      || (this.left.isAttack() && this.canActivateLeft())
  },
  canActivateLeft: function () {
    return !this.isActive() && !this.left.isCooldown() && !this.fighter.movement.isDodging() && this.fighter.stamina.has(this.left.cost())
  },
  canActivateRight: function () {
    return !this.isActive() && !this.right.isCooldown() && !this.fighter.movement.isDodging() && this.fighter.stamina.has(this.right.cost())
  },
  canDeactivateLeft: function () {
    return this.left.isActive()
  },
  canDeactivateRight: function () {
    return this.right.isActive()
  },
  canDefend: function () {
    return (this.right.isDefend() && this.canActivateRight())
      || (this.left.isDefend() && this.canActivateLeft())
  },
  deactivate: function () {
    return this.deactivateLeft().deactivateRight()
  },
  deactivateLeft: function () {
    if (this.canDeactivateLeft()) {
      this.left.deactivate()
    }

    return this
  },
  deactivateRight: function () {
    if (this.canDeactivateRight()) {
      this.right.deactivate()
    }

    return this
  },
  defend: function () {
    if (this.right.isDefend() && this.canActivateRight()) {
      return this.activateRight()
    }

    if (this.left.isDefend() && this.canActivateLeft()) {
      return this.activateLeft()
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
  isAttackCooldown: function () {
    // For AI to inspect player attack status
    return (this.left.isAttack() && this.left.isCooldown())
      || (this.right.isAttack() && this.right.isCooldown())
  },
  isAttacking: function () {
    // For AI to inspect player attack status
    return (this.left.isAttack() && this.left.isActive())
      || (this.right.isAttack() && this.right.isActive())
  },
  isDefendCooldown: function () {
    // For AI to inspect player defend status
    return (this.left.isDefend() && this.left.isCooldown())
      || (this.right.isDefend() && this.right.isCooldown())
  },
  isDefending: function () {
    // For AI to inspect player defend status
    return (this.left.isDefend() && this.left.isActive())
      || (this.right.isDefend() && this.right.isActive())
  },
  reset: function () {
    this.left.reset()
    this.right.reset()

    return this
  },
  stopDefending: function () {
    if (this.left.isDefend() && this.left.isActive()) {
      this.left.deactivate()
    }

    if (this.right.isDefend() && this.right.isActive()) {
      this.right.deactivate()
    }

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
