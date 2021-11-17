content.prop.footstep = engine.prop.base.invent({
  name: 'footstep',
  fadeInDuration: engine.const.zeroTime,
  fadeOutDuration: engine.const.zeroTime,
  onConstruct: function (options) {
    this.play(options).then(() => {
      engine.props.destroy(this)
    })

    return this
  },
  play: function ({
    fighter,
    velocity = 0,
  } = {}) {
    // XXX: Placeholder
    // TODO: Implement

    const duration = 0.5,
      gain = engine.utility.humanizeDb(engine.utility.fromDb(engine.utility.lerp(-9, -3, velocity)), -12),
      now = engine.audio.time()

    this.synth = engine.audio.synth.createSimple({
      detune: fighter.detune + engine.utility.random.float(-10, 10),
      frequency: 32,
      type: 'sawtooth',
    }).connect(this.output)

    this.synth.param.gain.exponentialRampToValueAtTime(gain, now + 1/32)
    this.synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + duration)
    this.synth.stop(now + duration)

    return engine.utility.timing.promise(duration * 1000)
  },
})
