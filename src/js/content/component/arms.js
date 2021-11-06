content.component.arms = {}

content.component.arms.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.arms.prototype = {
  construct: function () {
    this.left = content.component.arm.create({
      quaternionOffset: engine.utility.quaternion.fromEuler({
        yaw: Math.PI/2,
      }),
    })

    this.right = content.component.arm.create({
      quaternionOffset: engine.utility.quaternion.fromEuler({
        yaw: -Math.PI/2,
      }),
    })

    return this
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
