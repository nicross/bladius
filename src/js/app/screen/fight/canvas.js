app.screen.fight.canvas = (() => {
  const drawDistance = 50,
    vfov = engine.utility.degreesToRadians(120) * (9/16)

  let context,
    height,
    hfov,
    particles = [],
    particleRadius,
    root,
    width

  engine.ready(() => {
    root = document.querySelector('.a-fight--canvas')
    context = root.getContext('2d')

    window.addEventListener('resize', onResize)
    onResize()

    app.state.screen.on('enter-fight', onEnter)
    app.state.screen.on('exit-fight', onExit)
  })

  function clear() {
    context.clearRect(0, 0, width, height)
  }

  function draw() {
    // Tracer effect
    context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    context.fillRect(0, 0, width, height)

    for (const particle of particles) {
      // Filter out particles behind field of view
      if (particle.relative.x <= 0) {
        continue
      }

      // Calculate distance
      const distance = particle.relative.distance()

      // Filter out nodes beyond draw distance
      if (distance > drawDistance) {
        continue
      }

      // Calculate horizontal position
      const hangle = Math.atan2(particle.relative.y, particle.relative.x)

      // Filter out particles beyond horizontal field of view (with leeway)
      if (Math.abs(hangle) > hfov / 1.75) {
        continue
      }

      // Calculate width
      const radius = engine.utility.lerpExp(0, particleRadius, 1 - (distance / drawDistance), 16)

      // Draw
      const color = particle.isHero
        ? `rgba(0, 199, 255, ${particle.life})`
        : `rgba(255, 0, 105, ${particle.life})`

      const x = (width / 2) - (width * hangle / hfov) - (radius / 2)
      const y = (height - radius) * (particle.z)

      context.fillStyle = color
      context.fillRect(x, y, radius, radius)
    }
  }

  function generateParticle({
    isHero,
    x,
    y,
    z,
  }) {
    const velocity = engine.utility.vector2d.unitX()
      .scale(engine.utility.random.float(0, 1/8))
      .rotate(Math.PI * engine.utility.random.float(-1, 1))

    particles.push({
      isHero,
      life: 1,
      vector: engine.utility.vector2d.create({x, y}),
      velocity,
      z,
    })
  }

  function generateParticles() {
    for (const prop of engine.props.get()) {
      if (content.prop.movement.isPrototypeOf(prop)) {
        continue
      }

      generateParticle({
        isHero: prop.isHero,
        x: prop.x,
        y: prop.y,
        z: Math.random(),
      })
    }
  }

  function onEnter() {
    clear()
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
    particles = []
  }

  function onFrame() {
    generateParticles()
    updateParticles()
    draw()
  }

  function onResize() {
    height = root.height = root.clientHeight
    width = root.width = root.clientWidth
    hfov = vfov * (width / height)
    particleRadius = 16 * (width / 1920)
  }

  function updateParticles() {
    const angle = Math.PI - content.hero.body.angle,
      delta = engine.loop.delta(),
      position = content.hero.body.vector.clone()

    particles = particles.reduce((particles, particle) => {
      particle.life -= delta

      if (particle.life <= 0) {
        return particles
      }

      particle.vector = particle.vector.add(
        particle.velocity.scale(delta)
      )

      particle.relative = position.subtract(particle.vector).rotate(angle)

      particles.push(particle)
      return particles
    }, [])
  }

  return {}
})()
