content.hero = content.component.fighter.create({
  attributes: {
    defaults: {},
    filter: (attribute) => attribute.isHero,
  },
})

engine.state.on('reset', () => {
  content.hero.reset()
})
