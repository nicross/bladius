content.component.attribute.healing = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'healing',
    name: 'Healing',
    isHero: true,
    isPublic: false,
    compute: function ({
      multiplier: mask = 1,
    } = {}) {
      // Heal half of starting health per second
      return 5 * this.multiplier * mask
    },
  })
)
