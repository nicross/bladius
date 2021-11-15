content.fighters = (() => {
  const fighters = new Set(),
    pubsub = engine.utility.pubsub.create()

  function add(fighter) {
    fighters.add(fighter)
    pubsub.emit('add', fighter)
  }

  function remove(fighter) {
    fighters.delete(fighter)
    pubsub.emit('remove', fighter)
  }

  return engine.utility.pubsub.decorate({
    create: function (...args) {
      const fighter = content.component.fighter.create(...args)
      return this.manage(fighter)
    },
    get: () => [...fighters],
    manage: function (fighter) {
      add(fighter)
      fighter.once('destroy', () => remove(fighter))
      return fighter
    },
    reset: function () {
      for (const fighter of fighters) {
        // Keep hero but destroy others
        if (fighter === content.hero) {
          fighter.reset()
        }  else {
          fighter.destory()
        }
      }

      return this
    },
    update: function () {
      for (const fighter of fighters) {
        fighter.update()
      }

      return this
    },
  }, pubsub)
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.fighters.update()
})

engine.state.on('reset', () => content.fighters.reset())
