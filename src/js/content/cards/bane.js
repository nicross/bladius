content.cards.bane = (() => {
  const archetypes = []

  const levels = 4

  const types = [
    {name: 'Wounded', stat: 'health'},
    {name: 'Fatigued', stat: 'stamina'},
    {name: 'Weakened', stat: 'attack'},
    {name: 'Vulnerable', stat: 'defense'},
    /*
    {name: 'Tolerance', stat: 'healing'},
    {name: 'Dazed', stat: 'attackSpeed'},
    {name: 'Encumbered', stat: 'moveSpeed'},
    {name: 'Hungry', stat: 'staminaRegen'},
    */
  ]

  for (let level = 1; level <= levels; level += 1) {
    for (const type of types) {
      const stats = {}
      stats[type.stat] = -level

      invent({
        bonus: level,
        cost: 2 ** level,
        isStarter: level == 1,
        name: `${type.name} ${level}`,
        stats,
        weight: engine.utility.scale(level, 1, 4, 1/4, 1/4/4),
      })
    }
  }

  function define(definition) {
    definition = {...definition}

    definition.isBonus = true
    definition.isPassive = true
    definition.type = 'Bane'

    return definition
  }

  function invent(definition) {
    definition = define(definition)

    content.cards.register(definition)
    archetypes.push(definition)
  }

  return {
    archetypes: [...archetypes],
    define,
    invent,
  }
})()
