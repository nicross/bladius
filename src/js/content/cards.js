content.cards = (() => {
  const registry = []

  return {
    generate: () => {
      const shuffled = engine.utility.shuffle(registry)
      const card = engine.utility.chooseWeighted(shuffled, Math.random())
      return {...card}
    },
    generateBoosterPack: (count = 3) => {
      // Boosters consider rarity

      const cards = [],
        shuffled = engine.utility.shuffle(registry)

      for (let i = 0; i < count; i += 1) {
        const card = engine.utility.chooseWeighted(shuffled, Math.random())
        cards.push({...card})
      }

      return cards
    },
    generateStarterPack: () => {
      // Starter deck contains a little bit of everything

      const isBoon = Math.random() > 0.5

      const counts = {
        Armor: 1,
        Boon: isBoon ? 1 : 0,
        Bane: isBoon ? 0 : 1,
        Shield: 1,
        Weapon: 3,
      }

      // Group cards by type
      const cardsByType = {},
        shuffled = engine.utility.shuffle(registry)

      for (const card of shuffled) {
        if (!card.isStarter) {
          continue
        }

        const type = card.type

        if (!cardsByType[type]) {
          cardsByType[type] = []
        }

        cardsByType[type].push(card)
      }

      // Pick cards of each type
      const cards = []

      for (const type of Object.keys(counts)) {
        const count = counts[type]

        for (let i = 0; i < count; i += 1) {
          cards.push(
            engine.utility.chooseWeighted(cardsByType[type], Math.random())
          )
        }
      }

      return engine.utility.shuffle(cards)
    },
    generateStoreWares: (count = 3) => {
      // The store doesn't consider weight when choosing cards, never has duplicates

      const cards = [],
        shuffled = engine.utility.shuffle(registry)

      for (let i = 0; i < count; i += 1) {
        const card = engine.utility.chooseSplice(shuffled, Math.random())
        cards.push({...card})
      }

      return cards
    },
    register: function (definition) {
      // XXX: Generate random sounds if undefined
      if (!definition.sfx) {
        definition.sfx = {
          from: {
            color: Math.random(),
            colorRadius: Math.random()/2,
            mod: Math.random(),
            modRadius: Math.random()/2,
          },
          pitch: Math.random(),
          to: {
            color: Math.random(),
            colorRadius: Math.random()/2,
            mod: Math.random(),
            modRadius: Math.random()/2,
          },
        }
      }

      registry.push(definition)

      return this
    },
    registry: () => registry.map((card) => ({...card})),
  }
})()
