content.prop.movement = engine.prop.base.invent({
  name: 'movement',
  fadeInDuration: engine.const.zeroTime,
  fadeOutDuration: engine.const.zeroTime,
  onConstruct: function ({
    fighter,
  }) {
    this.fighter = fighter

    this.synth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.brown(),
    }).filtered({
      detune: fighter.detune,
      frequency: engine.const.minFrequency,
      type: 'lowpass',
    }).connect(this.output)

    return this
  },
  onDestroy: function () {
    this.synth.stop()

    return this
  },
  onUpdate: function () {
    // XXX: Hardcoded max velocity
    const velocity = this.fighter.body.lateralVelocity.distance() / 5

    const location = this.fighter.body.vector.add(
      this.fighter.body.lateralVelocity.normalize()
    )

    this.x = location.x
    this.y = location.y
    this.recalculate()

    const frequency = engine.utility.lerp(20, 80, velocity),
      gain = engine.utility.fromDb(-6) * (velocity ** 0.5)

    engine.audio.ramp.set(this.synth.param.gain, gain)
    engine.audio.ramp.set(this.synth.filter.frequency, frequency)

    return this
  },
})
