content.component.hand = {}

content.component.hand.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.hand.prototype = {
  construct: function () {
    this.attributes = {}
    this.cards = []

    return this
  },
  reset: function () {
    this.attributes = {}
    this.cards = []

    return this
  },
  set: function (cards = []) {
    // Require valid hand
    const validation = this.validate(cards)

    if (validation.filter((result) => !result).length) {
      return this
    }

    // Set cards
    this.attributes = {}
    this.cards = [...cards].slice(0, 3)

    // Analyze cards
    const actives = []

    for (const card of cards) {
      if (card.isActive) {
        // Collect active cards
        actives.push(card)
      } else if (card.isPassive) {
        // Collect passive stats
        for (const [key, values] of Object.entries(card.attributes || {})) {
          if (!this.attributes[key]) {
            this.attributes[key] = {
              modifier: 0,
              multiplier: 1,
            }
          }

          if (values.modifier) {
            this.attributes[key].modifier += values.modifier
          }

          if (values.multiplier) {
            this.attributes[key].multiplier *= values.multiplier
          }
        }
      }
    }

    // Resolve primary and secondary
    actives.sort((a, b) => {
      // Prefer secondary shields
      if (a.type == 'Shield') {
        return 1
      }

      if (b.type == 'Shield') {
        return -1
      }

      // Prefer stronger primary
      return b.attributes.attack.modifier - a.attributes.attack.modifier
    })

    // Pad actives with special unarmed cards
    while (actives.length < 2) {
      actives.push(content.cards.weapon.unarmed())
    }

    this.primary = actives.shift()
    this.secondary = actives.shift()

    return this
  },
  sort: function (cards = this.cards) {
    cards = [...cards].sort((a, b) => {
      if (a === this.primary) {
        return -1
      }

      if (a === this.secondary) {
        return b === this.primary
          ? 1
          : -1
      }

      if (b === this.primary) {
        return 1
      }

      if (b === this.secondary) {
        return 1
      }

      return a.name.localeCompare(b.name)
    })

    return cards
  },
  validate: function (cards = []) {
    cards = [...cards].slice(0, 3)

    const armors = {},
      shields = [],
      weapons = []

    for (const index in cards) {
      const card = cards[index]

      if (card.type == 'Armor') {
        if (!armors[card.subtype]) {
          armors[card.subtype] = []
        }

        armors[card.subtype].push(index)
      }

      if (card.type == 'Shield') {
        shields.push(index)
      }

      if (card.type == 'Weapon') {
        weapons.push(index)
      }
    }

    const result = cards.map(() => true)

    // Limit to unique UUIDs
    const uuids = new Set()

    for (const index in cards) {
      const card = cards[index]

      if (card.uuid) {
        if (uuids.has(card.uuid)) {
          result[index] = false
        } else {
          uuids.add(card.uuid)
        }
      }
    }

    // Limit one piece of armor per subtype
    for (const indices of Object.values(armors)) {
      if (indices.length > 1) {
        indices.sort((a, b) => cards[a].attributes.defense - cards[b].attributes.defense)

        for (const index of indices.slice(1, indices.length)) {
          result[index] = false
        }
      }
    }

    // Limit one shield
    if (shields.length > 1) {
      shields.sort((a, b) => cards[a].attributes.defense - cards[b].attributes.defense)

      for (const index of shields.slice(1, shields.length)) {
        result[index] = false
      }

      shields.length = 1
    }

    // Limit two weapons
    if (weapons.length > 2) {
      weapons.sort((a, b) => cards[a].attributes.attack - cards[b].attributes.attack)

      for (const index of weapons.slice(2, weapons.length)) {
        result[index] = false
      }

      weapons.length = 2
    }

    // Limit two hands, discarding random card
    if (shields.length + weapons.length > 2) {
      const index = Math.random() > 0.5
        ? weapons.pop()
        : shields.pop()

      result[index] = false
    }

    return result
  },
}
