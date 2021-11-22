content.component.attribute.intelligence = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'intelligence',
    name: 'Intelligence',
    isEnemy: true,
    compute: function (mask) {
      let value = this.computeLinear({
        base: 1,
        increment: 1,
        mask,
      }) / (16 + 1)

      value = engine.utility.clamp(value, 0, 1)

      return Math.sqrt(value)
    },
  })
)
