content.collisions = (() => {
  const pubsub = engine.utility.pubsub.create()

  function calculateDamage(attack, defense, ratio = 1) {
    attack = Math.max(0, attack)
    defense = Math.max(0, defense)

    return ratio * attack / (defense + 1)
  }

  function check() {
    const hero = content.hero,
      enemies = content.enemies.get()

    if (hero.movement.isDodging()) {
      return
    }

    const heroBody = content.hero.body.collisionCircle(),
      heroCollider = content.hero.arms.getActiveCollisionCircle(),
      heroIsAttacking = content.hero.arms.isAttacking(),
      heroIsAttackingUnarmed = heroIsAttacking && content.hero.arms.getActive().card.subtype == 'Unarmed',
      heroIsDefending = content.hero.arms.isDefending()

    for (const enemy of enemies) {
      if (enemy.movement.isDodging()) {
        continue
      }

      const enemyBody = enemy.body.collisionCircle(),
        enemyCollider = enemy.arms.getActiveCollisionCircle(),
        enemyIsAttacking = enemy.arms.isAttacking(),
        enemyIsAttackingUnarmed = enemyIsAttacking && enemy.arms.getActive().card.subtype == 'Unarmed',
        enemyIsDefending = enemy.arms.isDefending()

      // Hero and enemy parry (must not be unarmed)
      if (
           heroCollider && heroIsAttacking && (!heroIsAttackingUnarmed || enemyIsAttackingUnarmed) && enemyCollider && enemyIsAttacking && (!enemyIsAttackingUnarmed || heroIsAttackingUnarmed)
        && heroCollider.intersectsCircle(enemyCollider)
      ) {
        handleParry(hero, enemy)
        break
      }

      // Enemy blocks hero attack (shield or unarmed)
      if (
           heroCollider && heroIsAttacking && enemyCollider && (enemyIsDefending || enemyIsAttackingUnarmed)
        && heroCollider.intersectsCircle(enemyCollider)
      ) {
        handleBlock(hero, enemy)
        break
      }

      // Hero blocks enemy attack (shield or unarmed)
      if (
           heroCollider && (heroIsDefending || heroIsAttackingUnarmed) && enemyCollider && enemyIsAttacking
        && heroCollider.intersectsCircle(enemyCollider)
      ) {
        handleBlock(enemy, hero)
        break
      }

      // Hero attacks enemy
      if (
           heroCollider && heroIsAttacking
        && heroCollider.intersectsCircle(enemyBody)
      ) {
        handleAttack(hero, enemy)
        break
      }

      // Enemy attacks hero
      if (
           enemyCollider && enemyIsAttacking
        && enemyCollider.intersectsCircle(heroBody)
      ) {
        handleAttack(enemy, hero)
        break
      }
    }
  }

  function handleAttack(from, to) {
    // Approximate location
    const where = to == content.hero
      ? to.body.vector.clone()
      : engine.utility.centroid([
          from.arms.getActive().position(),
          to.body.vector,
        ])

    // Apply damage
    const {attack} = from.arms.getActive().compute()
    const {defense} = to.attributes.compute()
    const ratio = from.arms.getActive().ratio()
    const damage = calculateDamage(attack, defense, ratio)

    to.health.subtract(damage)

    pubsub.emit('attack', {
      from,
      to,
      where,
    })

    // Deactivate arms
    from.arms.deactivate()
    to.arms.deactivate()
  }

  function handleBlock(from, to) {
    // Approximate location
    const where = engine.utility.centroid([
      from.arms.getActive().position(),
      to.arms.getActive().position(),
    ])

    // Apply damage
    const {attack} = from.arms.getActive().compute()
    const {defense} = to.arms.getActive().compute()
    const ratio = from.arms.getActive().ratio()
    const damage = calculateDamage(attack, defense, ratio) / 2

    to.health.subtract(damage)

    pubsub.emit('block', {
      from,
      to,
      where,
    })

    // Deactivate arms
    from.arms.deactivate()

    // Deactivate unarmed attacks, but not shields
    if (to.arms.isAttacking()) {
      to.arms.deactivate()
    }
  }

  function handleParry(from, to) {
    // Approximate location
    const where = engine.utility.centroid([
      from.arms.getActive().position(),
      to.arms.getActive().position(),
    ])

    pubsub.emit('parry', {
      from,
      to,
      where,
    })

    // Deactivate arms
    from.arms.deactivate()
    to.arms.deactivate()
  }

  return engine.utility.pubsub.decorate({
    update: function () {
      check()

      return this
    },
  }, pubsub)
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.collisions.update()
})
