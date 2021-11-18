content.audio.footsteps = (() => {
  const bus = content.audio.createBus()

  function onStep(fighter) {
    const isLeft = fighter.footsteps.isLeft,
      maxVelocity = 5,
      velocity = engine.utility.clamp(fighter.body.lateralVelocity.distance() / maxVelocity, 0, 1)

    const location = fighter.body.vector.clone().add(
      engine.utility.vector2d.unitX().scale(fighter.body.radius / 2).rotate(fighter.body.angle + (isLeft ? Math.PI/2 : -Math.PI/2))
    )

    engine.props.create(content.prop.footstep, {
      destination: bus,
      fighter,
      velocity,
      x: location.x,
      y: location.y,
      z: -2,
    })
  }

  return {
    onFighterAdd: function (fighter) {
      fighter.on('step', onStep)
      return this
    },
    onFighterRemove: function (fighter) {
      fighter.off('step', onStep)
      return this
    },
  }
})()

engine.ready(() => {
  content.fighters.on('add', (...args) => content.audio.footsteps.onFighterAdd(...args))
  content.fighters.on('remove', (...args) => content.audio.footsteps.onFighterRemove(...args))

  // XXX: Race condition, hero is defined before content.fighters add event is fired
  content.audio.footsteps.onFighterAdd(content.hero)
})
