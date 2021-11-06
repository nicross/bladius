content.component.attribute.attackSpeed = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'attackSpeed',
    name: 'Attack Speed',
    isEnemy: true,
    isHero: true,
    compute: function () {
      // Base attack speed is 1 attack per second
      return 1 * this.multiplier
    },
  })
)
