content.hero = content.fighters.create({
  attributes: {
    defaults: {},
    filter: (attribute) => attribute.isHero,
  },
  detune: 0,
})

engine.ready(() => {
  content.potions.on('use', () => content.hero.health.heal(
    content.hero.health.max - content.hero.health.value
  ))
})
