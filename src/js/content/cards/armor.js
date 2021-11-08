content.cards.armor = (() => {
  const archetypes = []

  const materials = [
    {name: 'Cloth', bonus: 1},
    {name: 'Leather', bonus: 2},
    {name: 'Bronze', bonus: 3},
    {name: 'Iron', bonus: 4},
    {name: 'Steel', bonus: 5},
    {name: 'Diamond', bonus: 6},
  ]

  const types = [
    {name: 'Gauntlets', bonus: 1},
    {name: 'Pauldrons', bonus: 1},
    {name: 'Vambraces', bonus: 1},
    {name: 'Greaves', bonus: 2},
    {name: 'Helmet', bonus: 3},
    {name: 'Cuirass', bonus: 4},
  ]

  for (const material of materials) {
    for (const type of types) {
      invent({
        attributes: {
          defense: {
            modifier: material.bonus + type.bonus,
          },
        },
        cost: material.bonus + type.bonus,
        isStarter: (material.bonus + type.bonus) <= 2,
        name: `${material.name} ${type.name}`,
        subtype: type.name,
        weight: engine.utility.scale(material.bonus, 1, 6, 1/6, 1/6/6),
      })
    }
  }

  function define(definition) {
    definition = {...definition}

    definition.action = 'passive'
    definition.isPassive = true
    definition.type = 'Armor'

    return definition
  }

  function invent(definition) {
    definition = define(definition)

    content.cards.register(definition)
    archetypes.push(definition)
  }

  return {
    archetypes: () => [...archetypes],
    define,
    invent,
  }
})()
