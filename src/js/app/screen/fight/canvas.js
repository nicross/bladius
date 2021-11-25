app.screen.fight.canvas = (() => {
  const color = '#FF0069'

  let context,
    height,
    mToPx,
    particles = [],
    root,
    width

  engine.ready(() => {
    root = document.querySelector('.a-fight--canvas')
    context = root.getContext('2d')

    window.addEventListener('resize', onResize)
    onResize()

    content.collisions
      .on('attack', onCollision)
      .on('block', onCollision)
      .on('parry', onCollision)

    app.state.screen.on('enter-fight', onEnter)
    app.state.screen.on('exit-fight', onExit)
  })

  function clear() {
    context.clearRect(0, 0, width, height)
  }

  function collectCircles() {
    const circles = []

    for (const enemy of content.enemies.get()) {
      const arm = enemy.arms.getActiveCollisionCircle(),
        body = enemy.body.collisionCircle()

      if (arm) {
        arm.isArm = true
        circles.push(arm)
      }

      circles.push(body)
    }

    const heroArm = content.hero.arms.getActiveCollisionCircle()

    if (heroArm) {
      heroArm.isArm = true
      heroArm.isHero = true
      circles.push(heroArm)
    }

    const angle = Math.PI - content.hero.body.angle,
      position = content.hero.body.vector

    for (const circle of circles) {
      circle.relative = position.subtract(circle.vector).rotate(angle)
    }

    return circles
  }

  function draw() {
    const isPaused = engine.loop.isPaused()

    // Tracer effect
    if (!isPaused) {
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      context.fillRect(0, 0, width, height)
    }

    // Particles
    context.fillStyle = context.strokeStyle = color

    for (const particle of particles) {
      const radius = particle.radius * (1 - particle.life)

      const x = (width / 2) - (particle.relative.y * mToPx),
        y = (height / 2) - (particle.relative.x * mToPx)

      context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }

    // Circles
    for (const circle of collectCircles()) {
      context.strokeStyle = circle.isHero
       ? '#FFFFFF'
       : color

      const x = (width / 2) - (circle.relative.y * mToPx),
        y = (height / 2) - (circle.relative.x * mToPx)

      context.beginPath()
      context.arc(x, y, circle.radius * mToPx, 0, Math.PI * 2)

      if (circle.isArm) {
        context.stroke()
      } else {
        context.fill()
      }
    }

    // Player
    context.fillStyle = '#FFFFFF'
    context.beginPath()
    context.arc(width / 2, height / 2, content.hero.body.radius * mToPx, 0, Math.PI * 2)
    context.fill()
  }

  function generateParticle(vector) {
    const velocity = engine.utility.vector2d.unitX()
      .scale(engine.utility.random.float(1, 10))
      .rotate(Math.PI * engine.utility.random.float(-1, 1))

    particles.push({
      life: 1,
      radius: engine.utility.random.float(1, 3),
      rotate: Math.PI/8 * engine.utility.random.float(-1, 1),
      vector: vector.clone(),
      velocity,
    })
  }

  function generateParticles(vector, count = 0) {
    for (let i = 0; i < count; i += 1) {
      generateParticle(vector)
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
    updateParticles()
    draw()
  }

  function onCollision({
    where
  } = {}) {
    where = engine.utility.vector2d.create(where)
    generateParticles(where, 32)
  }

  function onResize() {
    height = root.height = root.clientHeight
    width = root.width = root.clientWidth
    mToPx = height / 25
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
        particle.velocity.scale(delta).rotate(particle.rotate)
      )

      particle.relative = position.subtract(particle.vector).rotate(angle)

      particles.push(particle)
      return particles
    }, [])
  }

  return {}
})()
