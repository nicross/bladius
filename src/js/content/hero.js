content.hero = content.fighters.create({
  attributes: {
    defaults: {},
    filter: (attribute) => attribute.isHero,
  },
  detune: 0,
})
