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
    const now = engine.audio.time()

    const footDelay = 0,
      footDetune = fighter.detune + engine.utility.random.float(-10, 10),
      footDuration = 1/16,
      footGain = engine.utility.humanizeDb(engine.utility.fromDb(engine.utility.lerp(-4.5, 0, velocity)), -12)

    const foot = engine.audio.synth.createSimple({
      detune: footDetune,
      frequency: 32,
      type: 'sawtooth',
    }).filtered({
      detune: footDetune,
      frequency: 32 * (2 ** 5),
    }).connect(this.output)

    foot.param.gain.setValueAtTime(engine.const.zeroGain, now + footDelay)
    foot.param.gain.exponentialRampToValueAtTime(footGain, now + footDelay + 1/64)
    foot.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + footDelay + footDuration)
    foot.stop(now + footDelay + footDuration)

    return engine.utility.timing.promise((footDelay + footDuration) * 1000)
  },
})
