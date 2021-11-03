content.cards = (() => {
  const registry = []

  return {
    generate: () => {
      const archetype = engine.utility.chooseWeighted(registry, Math.random())
      return archetype.generate()
    },
    register: function (definition) {
      registry.push(definition)
      return this
    },
  }
})()
