content.component.attribute.health = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'health',
    name: 'Health',
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
