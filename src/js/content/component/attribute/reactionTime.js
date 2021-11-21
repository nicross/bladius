content.component.attribute.reactionTime = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'reactionTime',
    name: 'Reaction Time',
    isEnemy: true,
    compute: function () {
      return 1
    },
  })
)
