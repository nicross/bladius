content.component.attribute.bonus = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'bonus',
    name: 'Bonus',
    isHero: true,
    isPublic: false,
    compute: function ({
      modifier: mask = 1,
    } = {}) {
      // No bonus by default
      return this.modifier + mask
    },
  })
)
