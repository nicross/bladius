content.prop.swing = engine.prop.base.invent({
  name: 'swing',
  fadeInDuration: engine.const.zeroTime,
  fadeOutDuration: engine.const.zeroTime,
  onConstruct: function ({
    arm,
  }) {
    const fighter = arm.arms.fighter

    engine.utility.pubsub.decorate(this)

    this.arm = arm
    this.isHero = fighter === content.hero

    this.synth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.white(),
    }).filtered({
      detune: fighter.detune + engine.utility.random.float(-100, 100),
      frequency: engine.const.minFrequency,
      Q: 1,
      type: 'bandpass',
    }).connect(this.output)

    return this
  },
  onDestroy: function () {
    this.emit('destroy')
    this.synth.stop()

    return this
  },
  onUpdate: function () {
    const isActive = this.arm.isActive(),
      isCooldown = this.arm.isCooldown(),
      isAttack = this.arm.isAttack(),
      isHero = this.arm.arms.fighter === content.hero,
      position = this.arm.position(),
      ratio = this.arm.ratio()

    if (!(isActive || isCooldown) || ratio == 1) {
      engine.props.destroy(this)
      return this
    }

    this.x = position.x
    this.y = position.y
    this.recalculate()

    const maxFrequency = isActive
      ? ((isAttack ? 2000 : 400) * (isHero ? 0.25 : 1))
      : ((isAttack ? 200 : 100) * (isHero ? 0.5 : 1))

    const frequency = engine.utility.lerp(engine.const.minFrequency, maxFrequency, ratio),
      gain = engine.utility.fromDb(-6) * (1 - Math.abs((2 * ratio) - 1))

    engine.audio.ramp.set(this.synth.param.gain, gain)
    engine.audio.ramp.set(this.synth.filter.frequency, frequency)

    return this
  },
})
