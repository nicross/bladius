content.hero = content.component.fighter.create({
  attributes: {
    defaults: {},
    filter: (attribute) => attribute.isHero,
  },
})

engine.loop.on('frame', () => {
  content.hero.update()
})

engine.state.on('reset', () => {
  content.hero.reset()
})
