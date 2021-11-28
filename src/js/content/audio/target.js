content.audio.target = (() => {
  let prop

  function createProp(fighter) {
    prop = engine.props.create(content.prop.target, {
      fighter,
      x: fighter.body.vector.x,
      y: fighter.body.vector.y,
    })
  }

  function destroyProp() {
    engine.props.destroy(prop)
    prop = undefined
  }

  return {
    onChange: function (fighter) {
      if (fighter) {
        if (prop) {
          prop.retarget(fighter)
        } else {
          createProp(fighter)
        }
      } else if (prop) {
        destroyProp()
      }

      return this
    },
  }
})()

engine.ready(() => {
  content.target.on('change', (...args) => content.audio.target.onChange(...args))
})
