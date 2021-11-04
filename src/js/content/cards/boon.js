content.cards.boon = (() => {
  const archetypes = []

  const levels = 4

  const types = [
    {name: 'Vitality', stat: 'health'},
    {name: 'Endurance', stat: 'stamina'},
    {name: 'Might', stat: 'attack'},
    {name: 'Protection', stat: 'defense'},
    /*
    {name: 'Healing', stat: 'healing'},
    {name: 'Quickness', stat: 'attackSpeed'},
    {name: 'Swiftness', stat: 'moveSpeed'},
    {name: 'Vigor', stat: 'staminaRegen'},
    */
  ]

  for (let level = 1; level <= levels; level += 1) {
    for (const type of types) {
      const stats = {}
      stats[type.stat] = level

      invent({
        cost: 2 * level,
        isStarter: level == 1,
        name: `${type.name} ${level}`,
        stats,
        weight: engine.utility.scale(level, 1, 4, 1/4, 1/4/4),
      })
    }
  }

  function invent(definition) {
    definition.action = 'passive'
    definition.isPassive = true
    definition.type = 'Boon'

    content.cards.register(definition)
    archetypes.push(definition)
  }

  return {
    archetypes: [...archetypes],
    invent,
  }
})()
