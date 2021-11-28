content.prop.target = engine.prop.base.invent({
  fadeInDuration: 1/4,
  fadeOutDuration: 1/64,
  onConstruct: function ({
    fighter,
  } = {}) {
    this.fighter = fighter

    this.x = fighter.body.vector.x
    this.y = fighter.body.vector.y
    this.recalculate()

    const {
      amodDepth,
      amodFrequency,
      carrierGain,
      detune,
      filterFrequency,
    } = this.calculateParameters()

    this.synth = engine.audio.synth.createMod({
      amodDepth,
      amodFrequency,
      carrierDetune: detune,
      carrierFrequency: this.rootFrequency,
      carrierGain,
      carrierType: 'triangle',
      fmodDetune: detune,
      fmodDepth: this.rootFrequency / 2,
      fmodFrequency: this.rootFrequency * 1.5,
      fmodType: 'triangle',
      gain: engine.utility.fromDb(-6),
    }).filtered({
      detune,
      frequency: filterFrequency,
    }).connect(this.output)

    return this
  },
  onDestroy: function () {
    return this
  },
  onUpdate: function () {
    const destination = content.utility.accelerate.vector(
      this.vector(),
      this.fighter.body.vector.clone(),
      10
    )

    this.x = destination.x
    this.y = destination.y
    this.recalculate()

    const {
      amodDepth,
      amodFrequency,
      carrierGain,
      filterFrequency,
    } = this.calculateParameters()

    engine.audio.ramp.set(this.synth.filter.frequency, filterFrequency)
    engine.audio.ramp.set(this.synth.param.amod.depth, amodDepth)
    engine.audio.ramp.set(this.synth.param.amod.frequency, amodFrequency)
    engine.audio.ramp.set(this.synth.param.carrierGain, carrierGain)

    return this
  },
  calculateParameters: function () {
    const amodDepth = engine.utility.clamp(engine.utility.scale(this.distance, 2, 4, 1/2, 0), 0, 1/2)

    const angle = Math.atan2(this.relative.y, this.relative.x),
      headingRatio = (Math.cos(angle) + 1) / 2

    return {
      amodDepth,
      amodFrequency: engine.utility.lerp(16, 4, this.fighter.health.getRatio()),
      carrierGain: 1 - amodDepth,
      detune: this.fighter.detune + engine.utility.lerp(-1200, 0, headingRatio),
      filterFrequency: this.rootFrequency * engine.utility.lerp(8, 1, headingRatio),
    }
  },
  retarget: function (fighter) {
    this.fighter = fighter

    const {
      detune,
    } = this.calculateParameters()

    engine.audio.ramp.linear(this.synth.param.detune, detune, 1/2)
    engine.audio.ramp.linear(this.synth.param.fmod.detune, detune, 1/2)
    engine.audio.ramp.linear(this.synth.filter.detune, detune, 1/2)

    return this
  },
  rootFrequency: engine.utility.midiToFrequency(33),
})
