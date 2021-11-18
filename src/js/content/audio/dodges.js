content.audio.dodges = (() => {
  const bus = content.audio.createBus()

  function onDodge(fighter) {
    engine.props.create(content.prop.dodge, {
      destination: bus,
      fighter,
      x: fighter.body.vector.x,
      y: fighter.body.vector.y,
      z: -1,
    })
  }

  return {
    onFighterAdd: function (fighter) {
      fighter.on('dodge', onDodge)
      return this
    },
    onFighterRemove: function (fighter) {
      fighter.off('dodge', onDodge)
      return this
    },
  }
})()

engine.ready(() => {
  content.fighters.on('add', (...args) => content.audio.dodges.onFighterAdd(...args))
  content.fighters.on('remove', (...args) => content.audio.dodges.onFighterRemove(...args))

  // XXX: Race condition, hero is defined before content.fighters add event is fired
  content.audio.dodges.onFighterAdd(content.hero)
})
