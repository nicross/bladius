content.component.agent = {}

content.component.agent.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.agent.prototype = {
  construct: function ({
    fighter,
  } = {}) {
    this.fighter = fighter

    return this
  },
  rollFor: function (attribute, chance = 1) {
    return Math.random() <= (attribute * chance)
  },
  update: function () {
    // Idle when hero dead
    if (content.hero.health.isZero()) {
      return this
    }

    const {
      intelligence,
      reactionTime,
    } = this.fighter.attributes.compute()

    // Check against reaction time
    if (!this.rollFor(reactionTime)) {
      return this
    }

    // Collect inputs
    const canAttack = this.rollFor(intelligence) && this.fighter.arms.canAttack(),
      canDefend = this.rollFor(intelligence) && this.fighter.arms.canDefend(),
      canDodge = this.rollFor(intelligence) && this.fighter.movement.canDodge(),
      canSprint = this.fighter.movement.canSprint(),
      heroIsAttacking = this.rollFor(intelligence) && content.hero.arms.isAttacking(),
      heroIsDefending = this.rollFor(intelligence) && content.hero.arms.isDefending(),
      heroIsDodging = this.rollFor(intelligence) && content.hero.movement.isDodging(),
      idealDistance = (2 * this.fighter.arms.right.length) - engine.const.zero,
      isDefending = this.fighter.arms.isDefending(),
      relativeFromHero = this.fighter.body.vector.subtract(content.hero.body.vector).rotate(content.hero.body.angle),
      relativeToHero = content.hero.body.vector.subtract(this.fighter.body.vector).rotate(this.fighter.body.angle),
      stoppingDistance = this.fighter.movement.stoppingDistance()

    const angleFromHero = Math.atan2(relativeFromHero.y, relativeFromHero.x),
      angleToHero = Math.atan2(relativeToHero.y, relativeToHero.x),
      distanceToHero = relativeToHero.distance()

    // Calculate movement
    const input = {
      dodge: false,
      rotate: -Math.sin(angleToHero) * reactionTime,
      sprint: false,
      x: 0,
      y: 0,
    }

    if (distanceToHero > idealDistance + stoppingDistance) {
      const inputVector = content.hero.body.vector.subtract(this.fighter.body.vector).normalize()

      input.sprint = canSprint && this.fighter.stamina.has(engine.utility.lerp(0, 5, intelligence))
      input.x = inputVector.x
      input.y = inputVector.y
    }

    // Arms
    if (heroIsAttacking && (distanceToHero <= idealDistance)) {
      if (canDodge) {
        input.dodge = true
      } else if (canDefend) {
        this.fighter.arms.defend()
      } else if (canAttack) {
        this.fighter.arms.attack()
      }
    } else if (isDefending && this.rollFor(intelligence)) {
      this.fighter.arms.stopDefending()
    } else if (!heroIsDodging && canAttack && (distanceToHero <= idealDistance) && (!heroIsDefending || Math.cos(angleFromHero) > -0.5)) {
      this.fighter.arms.attack()
    }

    // Apply movement
    this.fighter.movement.input(input)

    return this
  },
}
