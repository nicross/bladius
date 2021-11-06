content.component.attribute.attack = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'attack',
    name: 'Attack',
    isEnemy: true,
    isHero: true,
    isPublic: true,
    compute: function () {
      const base = 10,
        level = this.level + this.modifier,
        modifier = 1 * level

      return (base + modifier) * this.multiplier
    },
  })
)
