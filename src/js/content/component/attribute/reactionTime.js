content.component.attribute.reactionTime = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'reactionTime',
    name: 'Reaction Time',
    isEnemy: true,
    compute: function (mask) {
      const delta = engine.performance.delta()

      let value = this.computeLinear({
        base: 1,
        increment: 1,
        mask,
      }) / (16 + 1)

      value = engine.utility.clamp(value, 0, 1)

      return engine.utility.lerp(delta, 1, value)
    },
  })
)
