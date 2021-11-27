content.prop.damage = engine.prop.base.invent({
  onConstruct: function ({
    fighter,
    velocity = 0,
  } = {}) {
    this.fighter = fighter
    this.isHero = fighter === content.hero

    const duration = 1/8,
      gain = velocity,
      now = engine.audio.time()

    const synth = engine.audio.synth.createBuffer({
      buffer: content.audio.buffer.generateSfx({
        duration: 1/128,
        exponent: engine.utility.random.float(0.5, 1.5),
        from: {
          color: engine.utility.random.float(0.95, 1),
          modulation: velocity,
        },
        pitch: engine.utility.clamp(engine.utility.scale(fighter.detune, 0, 1200, 0, 1), 0, 1) ** 0.5,
        to: {
          color: engine.utility.random.float(0, 0.05),
          modulation: 0,
        },
      }),
      playbackRate: 1/16,
      when: now,
    }).shaped(
      engine.audio.shape.noise8()
    ).shaped(
      engine.audio.shape.distort()
    ).filtered({
      detune: fighter.detune,
      frequency: 1333,
    }).connect(this.output)

    synth.param.gain.linearRampToValueAtTime(gain, now + 1/64)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

    synth.stop(now + duration)

    engine.utility.timing.promise(duration * 1000).then(() => {
      engine.props.destroy(this)
    })

    return this
  },
  onUpdate: function () {
    this.x = this.fighter.body.vector.x
    this.y = this.fighter.body.vector.y
    this.recalculate()

    return this
  },
})
