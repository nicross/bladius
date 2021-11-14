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
    this.left.update(...args)
    this.right.update(...args)

    return this
  },
}
