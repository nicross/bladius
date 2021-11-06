content.arms = content.component.arms.create()

engine.state.on('reset', () => {
  content.arms.reset()
})
