content.component.attribute.bonus = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'bonus',
    name: 'Bonus',
    isHero: true,
    isPublic: false,
    compute: function ({
      multiplier: mask = 1,
    } = {}) {
      // No bonus by default
      return 1 * this.multiplier * mask
    },
  })
)
