content.cards.weapon = (() => {
  const archetypes = []

  const materials = [
    {name: 'Wooden', bonus: 0},
    {name: 'Bronze', bonus: 2},
    {name: 'Iron', bonus: 4},
    {name: 'Steel', bonus: 6},
    {name: 'Diamond', bonus: 8},
    {name: 'Obsidian', bonus: 10},
  ]

  const types = [
    {name: 'Axe', bonus: 6, speed: 0.75},
    {name: 'Dagger', bonus: 1, speed: 1.5},
    {name: 'Mace', bonus: 2, speed: 1},
    {name: 'Sword', bonus: 3, speed: 1},
  ]

  const unarmed = define({
    attributes: {},
    cost: 0,
    isStarter: false,
    name: 'Unarmed',
    subtype: 'Unarmed',
    weight: 0,

    // XXX: Not registered
    sfx: {
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
    },
  })

  for (const material of materials) {
    for (const type of types) {
      invent({
        attributes: {
          attack: {
            modifier: material.bonus + type.bonus,
          },
          attackSpeed: {
            multiplier: type.speed,
          },
        },
        cost: material.bonus + Math.min(4, type.bonus),
        isStarter: material.bonus <= 2,
        name: `${material.name} ${type.name}`,
        subtype: type.name,
        weight: engine.utility.scale(material.bonus, 1, 6, 1/4, 1/4/6),
      })
    }
  }

  function define(definition) {
    definition = {...definition}

    definition.action = 'attack'
    definition.isActive = true
    definition.type = 'Weapon'

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
    unarmed: () => ({...unarmed}),
  }
})()
