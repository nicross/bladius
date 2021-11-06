content.component.attribute.health = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'health',
    name: 'Health',
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
