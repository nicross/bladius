content.camera = {
  update: function () {
    engine.position.setEuler({pitch: content.hero.body.angle})
    engine.position.setVector(content.hero.vector)

    return this
  },
}

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.camera.update()
})
