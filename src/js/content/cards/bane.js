content.cards.bane = (() => {
  const archetypes = []

  const levels = 4

  const types = [
    {name: 'Wounded', modifier: 'health'},
    {name: 'Fatigued', modifier: 'stamina'},
    {name: 'Weakened', modifier: 'attack'},
    {name: 'Vulnerable', modifier: 'defense'},
    /*
    {name: 'Tolerance', stat: 'healing'},
    {name: 'Dazed', stat: 'attackSpeed'},
    {name: 'Encumbered', stat: 'moveSpeed'},
    {name: 'Hungry', stat: 'staminaRegen'},
    */
  ]

  for (let level = 1; level <= levels; level += 1) {
    for (const type of types) {
      const attributes = {}

      if (type.modifier) {
        attributes[type.modifier] = {
          modifier: -level,
        }
      }

      if (type.multiplier) {
        attributes[type.multiplier] = {
          multiplier: 1 - (level / 5),
        }
      }

      attributes.bonus = {
        multiplier: 1 + level,
      }

      invent({
        attributes,
        cost: 2 + (2 ** level),
        isStarter: level == 1,
        name: `${type.name} ${level}`,
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
