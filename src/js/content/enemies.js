content.enemies = (() => {
  const fighters = [],
    pubsub = engine.utility.pubsub.create(),
    queue = []

  const validAttributes = [
    'attack',
    'defense',
    'health',
    'intelligence',
    'reactionTime',
    'stamina',
  ]

  let timer

  function generate() {
    const count = generateCount(),
      deck = generateDeck(),
      enemies = []

    let attributePoints = generateAttributePoints()

    for (let i = 0; i < count; i += 1) {
      const attributes = {}

      let enemyPoints = engine.utility.random.integer(Math.floor(attributePoints/2), attributePoints)

      // Allocate points to random attributes
      while (enemyPoints-->0) {
        const key = engine.utility.choose(validAttributes, Math.random())

        if (!attributes[key]) {
          attributes[key] = {
            level: 0,
          }
        }

        attributes[key].level += 1
        attributePoints -= 1
      }

      enemies.push({
        attributes,
        hand: deck.drawValidHand(),
      })
    }

    return engine.utility.shuffle(enemies)
  }

  function generateAttributePoints() {
    const level = content.level.get()

    // Scale max points base on level
    let max = level * engine.utility.scale(level, 1, 10, 1, 2)
    max = Math.round(max)

    // Randomize it between [level, max]
    return engine.utility.random.integer(level, max)
  }

  function generateCount() {
    const level = content.level.get(),
      max = 3

    // Scale count to max based on hero level
    let count = engine.utility.scale(level, 0, 10, 1, max)
    count = Math.min(count, max)
    count = Math.round(count)

    // Randomize it
    return engine.utility.random.integer(1, count)
  }

  function generateDeck() {
    const deck = content.component.deck.create()

    // Copy hero deck to mirror progress
    deck.add(...content.deck.get())

    // Add some easy cards and wildcards
    deck.add(...content.cards.generateStarterPack())
    deck.add(...content.cards.generateBoosterPack())

    // Randomize it
    return deck.shuffle()
  }

  function generatePosition() {
    const angle = engine.utility.random.float(0, 2 * Math.PI),
      distance = engine.utility.random.float(25, 50),
      hero = content.hero.body.vector.clone()

    return hero.add(
      engine.utility.vector2d.unitX().scale(distance).rotate(angle)
    )
  }

  function spawn(options) {
    const fighter = content.fighters.create({
      ...options,
      body: {
        vector: generatePosition(),
      },
    })

    fighters.push(fighter)
    pubsub.emit('spawn', fighter)
  }

  return engine.utility.pubsub.decorate({
    generate: function () {
      const enemies = generate()

      for (const enemy of enemies) {
        queue.push(enemy)
      }

      timer = 1

      return this
    },
    get: () => [...fighters],
    queued: () => [...queue],
    reset: function () {
      fighters.length = 0
      queue.length = 0

      return this
    },
    update: function () {
      if (!queue.length) {
        return this
      }

      timer -= engine.loop.delta()

      if (timer <= 0) {
        spawn(queue.shift())
        timer = engine.utility.random.float(0.5, 1)
      }

      return this
    },
  }, pubsub)
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.enemies.update()
})

engine.state.on('reset', () => content.enemies.reset())
