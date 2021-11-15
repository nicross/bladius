content.audio.footsteps = (() => {
  const bus = content.audio.createBus()

  function onStep(fighter) {
    // TODO: Generate footstep prop at fighter foot
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
    update: function () {
      return this
    },
  }
})()

engine.ready(() => {
  content.fighters.on('add', (...args) => content.audio.footsteps.onFighterAdd(...args))
  content.fighters.on('remove', (...args) => content.audio.footsteps.onFighterRemove(...args))

  content.audio.footsteps.onFighterAdd(content.hero)
})

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.footsteps.update()
})
