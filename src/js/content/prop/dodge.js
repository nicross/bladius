content.prop.dodge = engine.prop.base.invent({
  name: 'dodge',
  onConstruct: function ({
    fighter,
  }) {
    this.fighter = fighter
    this.frequency = engine.utility.random.float(20, 24)
    this.isHero = fighter === content.hero
    this.progress = 0
    this.time = engine.loop.time()

    this.noise = engine.utility.createNoiseWithOctaves({
      octaves: 4,
      seed: ['dodge', performance.now()],
      type: engine.utility.perlin1d,
    })

    this.synth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.brown(),
    }).filtered({
      detune: fighter.detune + engine.utility.random.float(-100, 100),
      frequency: engine.const.minFrequency,
      Q: 1,
      type: 'bandpass',
    }).connect(this.output)

    return this
  },
  onDestroy: function () {
    this.synth.stop()

    return this
  },
  onUpdate: function () {
    // XXX: Hardcoded dodge duration
    const ratio = engine.utility.clamp((engine.loop.time() - this.time) / 0.5, 0, 1)

    if (ratio == 1) {
      engine.props.destroy(this)
      return this
    }

    this.x = this.fighter.body.vector.x
    this.y = this.fighter.body.vector.y
    this.recalculate()

    this.progress += engine.loop.delta() * engine.utility.lerp(1, this.frequency, 1 - Math.abs((2 * ratio) - 1))

    const maxFrequency = this.fighter === content.hero
      ? 666
      : 6666

    const frequency = engine.utility.lerpExp(engine.const.minFrequency, maxFrequency, this.noise.value(this.progress), 3),
      gain = (1 - Math.abs((2 * ratio) - 1))

    engine.audio.ramp.set(this.synth.param.gain, gain)
    engine.audio.ramp.set(this.synth.filter.frequency, frequency)

    return this
  },
})
