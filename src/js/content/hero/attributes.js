content.hero.attributes = content.component.attributes.create({
  defaults: {},
  filter: (attribute) => attribute.isHero,
})

engine.state.on('reset', () => content.hero.attributes.reset())
