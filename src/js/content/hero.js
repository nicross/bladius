content.hero = content.fighters.create({
  attributes: {
    defaults: {},
    filter: (attribute) => attribute.isHero,
  },
})

engine.state.on('reset', () => {
  content.hero.reset()
})
