content.target = (() => {
  const pubsub = engine.utility.pubsub.create(),
    targets = []

  let target

  return engine.utility.pubsub.decorate({
    all: () => [...targets],
    has: () => Boolean(target),
    get: () => target,
    onFighterAdd: function (fighter) {
      if (targets.includes(target) || fighter === content.hero) {
        return this
      }

      fighter.on('kill', () => this.onFighterRemove(fighter))
      targets.push(fighter)

      return this
    },
    onFighterRemove: function (fighter) {
      if (!targets.includes(fighter)) {
        return this
      }

      if (fighter === target) {
        this.next()
      }

      targets.splice(targets.indexOf(fighter), 1)

      return this
    },
    next: function () {
      const index = targets.indexOf(target)

      if (!targets.length) {
        return this
      }

      target = targets[index + 1]
      pubsub.emit('change', target)

      return this
    },
    previous: function () {
      const index = targets.indexOf(target)

      if (!targets.length) {
        return this
      }

      target = target
        ? targets[index - 1]
        : targets[targets.length - 1]

      pubsub.emit('change', target)

      return this
    },
    reset: function () {
      target = undefined
      targets.length = 0

      pubsub.emit('change', target)

      return this
    },
  }, pubsub)
})()

engine.ready(() => {
  content.fighters.on('add', (...args) => content.target.onFighterAdd(...args))
  content.fighters.on('remove', (...args) => content.target.onFighterRemove(...args))
})
