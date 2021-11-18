content.audio.movements = (() => {
  const bus = content.audio.createBus(),
    props = new Set()

  return {
    onFighterAdd: function (fighter) {
      const prop = engine.props.create(content.prop.movement, {
        destination: bus,
        fighter,
        x: fighter.body.vector.x,
        y: fighter.body.vector.y,
        z: -1,
      })

      props.add(prop)

      return this
    },
    onFighterRemove: function (fighter) {
      for (const prop of props) {
        if (prop.fighter === fighter) {
          engine.props.destroy(prop)
        }
      }

      return this
    },
  }
})()

engine.ready(() => {
  content.fighters.on('add', (...args) => content.audio.movements.onFighterAdd(...args))
  content.fighters.on('remove', (...args) => content.audio.movements.onFighterRemove(...args))

  // XXX: Race condition, hero is defined before content.fighters add event is fired
  content.audio.movements.onFighterAdd(content.hero)
})
