content.arms = {}

// Beware loading order in Gulpfile.js
content.arms.left = content.arm.create({
  angle: Math.PI/2,
})

content.arms.right = content.arm.create({
  angle: -Math.PI/2,
})

engine.state.on('reset', () => {
  content.arms.left.reset()
  content.arms.right.reset()
})
