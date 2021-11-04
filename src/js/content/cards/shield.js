content.cards.shield = (() => {
  const archetypes = []

  const materials = [
    {name: 'Wooden', bonus: 1},
    {name: 'Leather', bonus: 2},
    {name: 'Bronze', bonus: 3},
    {name: 'Iron', bonus: 4},
    {name: 'Steel', bonus: 5},
    {name: 'Diamond', bonus: 6},
  ]

  for (const material of materials) {
    invent({
      cost: 1 + material.bonus,
      isStarter: material.bonus <= 2,
      name: `${material.name} Shield`,
      stats: {
        defense: material.bonus,
      },
      weight: engine.utility.scale(material.bonus, 1, 6, 1/4, 1/4/6),
    })
  }

  function invent(definition) {
    definition.action = 'defend'
    definition.isActive = true
    definition.type = 'Shield'

    content.cards.register(definition)
    archetypes.push(definition)
  }

  return {
    archetypes: [...archetypes],
    invent,
  }
})()