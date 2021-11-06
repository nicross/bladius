content.component.attribute.stamina = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'stamina',
    name: 'Stamina',
    isEnemy: true,
    isHero: true,
    isPublic: true,
    compute: function (mask) {
      return this.computeLinear({
        base: 10,
        increment: 1,
        mask,
      })
    },
  })
)
