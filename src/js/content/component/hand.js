content.component.hand = {}

content.component.hand.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.hand.prototype = {
  construct: function () {
    this.cards = []
    this.stats = {}

    return this
  },
  set: function (cards = []) {
    // Require valid hand
    const validation = this.validate(cards)

    if (validation.filter((result) => !result).length) {
      return this
    }

    // Set cards
    this.cards = [...cards].slice(0, 3)
    this.stats = {}

    // Analyze cards
    const actives = []

    for (const card of cards) {
      if (card.isActive) {
        // Collect active cards
        actives.push(card)
      } else if (card.isPassive) {
        // Collect passive stats
        for (const [key, value] of Object.entries(card.stats || {})) {
          if (!this.stats[key]) {
            this.stats[key] = 0
          }

          // XXX: This will not work with stacking multipliers, e.g. 0.5 + 1.5 = 0.75, not 2.0
          // TODO: Improve sophistication of stat types
          this.stats[key] += value
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
      return b.stats.attack - a.stats.attack
    })

    // Pad actives with special unarmed cards
    while (actives.length < 2) {
      actives.push(content.cards.weapon.unarmed())
    }

    this.primary = actives.shift()
    this.secondary = actives.shift()

    return this
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

    // Limit one piece of armor per subtype
    for (const indices of Object.values(armors)) {
      if (indices.length > 1) {
        indices.sort((a, b) => cards[a].stats.defense - cards[b].stats.defense)

        for (const index of indices.slice(1, indices.length)) {
          result[index] = false
        }
      }
    }

    // Limit one shield
    if (shields.length > 1) {
      shields.sort((a, b) => cards[a].stats.defense - cards[b].stats.defense)

      for (const index of shields.slice(1, shields.length)) {
        result[index] = false
      }

      shields.length = 1
    }

    // Limit two weapons
    if (weapons.length > 2) {
      weapons.sort((a, b) => cards[a].stats.attack - cards[b].stats.attack)

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
