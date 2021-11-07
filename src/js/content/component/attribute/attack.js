content.component.attribute.attack = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'attack',
    name: 'Attack',
    description: 'Increases outgoing damage.',
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
