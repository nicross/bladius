content.audio.collisions = (() => {
  const bus = content.audio.createBus()

  return {
    onAttack: function ({
      from,
      to,
      where,
    } = {}) {
      engine.props.create(content.prop.collision, {
        cards: [
          from.arms.getActive().card,
        ],
        destination: bus,
        from,
        to,
        velocity: from.arms.getActive().ratio(),
        x: where.x,
        y: where.y,
      })

      engine.props.create(content.prop.damage, {
        destination: bus,
        fighter: to,
        velocity: from.arms.getActive().ratio(),
        x: to.body.vector.x,
        y: to.body.vector.y,
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
        from,
        to,
        velocity: from.arms.getActive().ratio(),
        x: where.x,
        y: where.y,
      })

      engine.props.create(content.prop.damage, {
        destination: bus,
        fighter: to,
        velocity: from.arms.getActive().ratio() / 2,
        x: to.body.vector.x,
        y: to.body.vector.y,
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
        from,
        to,
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
