content.collisions = (() => {
  const pubsub = engine.utility.pubsub.create()

  function calculateDamage(attack, defense) {
    return attack / (defense + 1)
  }

  function check() {
    const hero = content.hero,
      enemies = content.enemies.get()

    const heroBody = content.hero.body.collisionCircle(),
      heroCollider = content.hero.arms.getActiveCollisionCircle(),
      heroIsAttacking = content.hero.arms.isAttacking(),
      heroIsDefending = content.hero.arms.isDefending()

    for (const enemy of enemies) {
      const enemyBody = enemy.body.collisionCircle(),
        enemyCollider = enemy.arms.getActiveCollisionCircle(),
        enemyIsAttacking = enemy.arms.isAttacking(),
        enemyIsDefending = enemy.arms.isDefending()

      // Hero and enemy parry
      if (
           heroCollider && heroIsAttacking && enemyCollider && enemyIsAttacking
        && heroCollider.intersectsCircle(enemyCollider)
      ) {
        handleParry(hero, enemy)
        continue
      }

      // Enemy blocks hero attack
      if (
           heroCollider && heroIsAttacking && enemyCollider && enemyIsDefending
        && heroCollider.intersectsCircle(enemyCollider)
      ) {
        handleBlock(hero, enemy)
        continue
      }

      // Hero blocks enemy attack
      if (
           heroCollider && heroIsDefending && enemyCollider && enemyIsAttacking
        && heroCollider.intersectsCircle(enemyCollider)
      ) {
        handleBlock(enemy, hero)
        continue
      }

      // Hero attacks enemy
      if (
           heroCollider && heroIsAttacking
        && heroCollider.intersectsCircle(enemyBody)
      ) {
        handleAttack(hero, enemy)
        continue
      }

      // Enemy attacks hero
      if (
           enemyCollider && enemyIsAttacking
        && enemyCollider.intersectsCircle(heroBody)
      ) {
        handleAttack(enemy, hero)
        continue
      }
    }
  }

  function handleAttack(from, to) {
    // Approximate location
    const where = engine.utility.centroid([
      from.arms.getActiveCollisionCircle(),
      to.body.collisionCircle(),
    ])

    // Apply damage
    const {attack} = from.arms.getActive().compute()
    const {defense} = to.attributes.compute()
    const damage = calculateDamage(attack, defense)
    to.health.subtract(damage)

    // Deactivate arms
    from.arms.deactivate()

    pubsub.emit('attack', {
      from,
      to,
      where,
    })
  }

  function handleBlock(from, to) {
    // Approximate location
    const where = engine.utility.centroid([
      from.arms.getActiveCollisionCircle(),
      to.arms.getActiveCollisionCircle(),
    ])

    // Apply damage
    const {attack} = from.arms.getActive().compute()
    const {defense} = to.arms.getActive().compute()
    const damage = calculateDamage(attack, defense)
    to.health.subtract(damage)

    // Deactivate arms
    from.arms.deactivate()
    to.arms.deactivate()

    pubsub.emit('block', {
      from,
      to,
      where,
    })
  }

  function handleParry(from, to) {
    // Approximate location
    const where = engine.utility.centroid([
      from.arms.getActiveCollisionCircle(),
      to.arms.getActiveCollisionCircle(),
    ])

    // Deactivate arms
    from.arms.deactivate()
    to.arms.deactivate()

    pubsub.emit('parry', {
      from,
      to,
      where,
    })
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
