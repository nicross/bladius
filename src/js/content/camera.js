content.camera = {
  update: function () {
    engine.position.setEuler({yaw: content.hero.body.angle})
    engine.position.setVector(content.hero.body.vector)

    return this
  },
}

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.camera.update()
})
