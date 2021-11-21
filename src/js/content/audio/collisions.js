content.audio.collisions = (() => {
  const bus = content.audio.createBus()

  return {
    onAttack: function ({
      from,
      where,
    } = {}) {
      engine.props.create(content.prop.collision, {
        cards: [
          from.arms.getActive().card,
        ],
        destination: bus,
        velocity: from.arms.getActive().ratio(),
        x: where.x,
        y: where.y,
      })

      return this
    },
    onBlock: function ({
      from,
      to,
      where,
    } = {}) {
      engine.props.create(content.prop.collision, {
        cards: [
          from.arms.getActive().card,
          to.arms.getActive().card,
        ],
        destination: bus,
        velocity: from.arms.getActive().ratio(),
        x: where.x,
        y: where.y,
      })

      return this
    },
    onParry: function ({
      from,
      to,
      where,
    } = {}) {
      engine.props.create(content.prop.collision, {
        cards: [
          from.arms.getActive().card,
          to.arms.getActive().card,
        ],
        destination: bus,
        velocity: Math.min(1, from.arms.getActive().ratio() + to.arms.getActive().ratio()),
        x: where.x,
        y: where.y,
      })

      return this
    },
  }
})()

engine.ready(() => {
  content.collisions.on('attack', (...args) => content.audio.collisions.onAttack(...args))
  content.collisions.on('block', (...args) => content.audio.collisions.onBlock(...args))
  content.collisions.on('parry', (...args) => content.audio.collisions.onParry(...args))
})
