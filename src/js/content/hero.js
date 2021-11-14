content.hero = content.component.fighter.create({
  attributes: {
    defaults: {},
    filter: (attribute) => attribute.isHero,
  },
})

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.hero.update()
})

engine.state.on('reset', () => {
  content.hero.reset()
})
