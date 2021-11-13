content.camera = {
  update: function () {
    app.position.setEuler({pitch: content.hero.body.angle})
    app.position.setVector(content.hero.vector)

    return this
  },
}

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.camera.update()
})
