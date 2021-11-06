content.hero.arms = content.component.arms.create()

engine.state.on('reset', () => {
  content.hero.arms.reset()
})
