content.cards.boon = (() => {
  const archetypes = []

  const levels = 4

  const types = [
    {name: 'Vitality', modifier: 'health'},
    {name: 'Endurance', modifier: 'stamina'},
    {name: 'Might', modifier: 'attack'},
    {name: 'Protection', modifier: 'defense'},
    /*
    {name: 'Healing', stat: 'healing'},
    {name: 'Quickness', stat: 'attackSpeed'},
    {name: 'Swiftness', stat: 'moveSpeed'},
    {name: 'Vigor', stat: 'staminaRegen'},
    */
  ]

  for (let level = 1; level <= levels; level += 1) {
    for (const type of types) {
      const attributes = {}

      if (type.modifier) {
        attributes[type.modifier] = {
          modifier: level,
        }
      }

      if (type.multiplier) {
        attributes[type.multiplier] = {
          multiplier: 1 + (level / 4),
        }
      }

      invent({
        attributes,
        cost: 1 + (2 * level),
        isStarter: level == 1,
        name: `${type.name} ${level}`,
        weight: engine.utility.scale(level, 1, 4, 1/4, 1/4/4),
      })
    }
  }

  function define(definition) {
    definition = {...definition}

    definition.action = 'passive'
    definition.isPassive = true
    definition.type = 'Boon'

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
