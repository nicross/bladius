content.audio.swings = (() => {
  const bus = content.audio.createBus(),
    trackedArms = new Set()

  function collectUntracked() {
    return content.fighters.get().reduce((untrackedArms, fighter) => {
      const arms = [
        fighter.arms.left,
        fighter.arms.right,
      ]

      for (const arm of arms) {
        if (trackedArms.has(arm) || !(arm.isActive() || arm.isCooldown()) || arm.ratio() == 1) {
          continue
        }

        untrackedArms.push(arm)
      }

      return untrackedArms
    }, [])
  }

  function track(arm) {
    const position = arm.position()

    const prop = engine.props.create(content.prop.swing, {
      arm,
      destination: bus,
      x: position.x,
      y: position.y,
      z: 0,
    })

    trackedArms.add(arm)
    prop.on('destroy', () => trackedArms.delete(arm))
  }

  return {
    update: function () {
      const arms = collectUntracked()

      for (const arm of arms) {
        track(arm)
      }

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.swings.update()
})
