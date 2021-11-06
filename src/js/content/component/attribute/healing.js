content.component.attribute.healing = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'healing',
    name: 'Healing',
    isHero: true,
    isPublic: false,
    compute: function () {
      // Heal half of total health per second
      return 0.5 * this.multiplier
    },
  })
)
