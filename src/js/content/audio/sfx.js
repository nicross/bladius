content.audio.sfx = {}

content.audio.sfx.bus = content.audio.createBypass()
content.audio.sfx.bus.gain.value = engine.utility.fromDb(-12)

content.audio.sfx.coin = function (when = engine.audio.time()) {
  const note = 72

  const detune = engine.utility.random.float(-12.5, 12.5),
    frequency = engine.utility.midiToFrequency(note),
    gain = engine.utility.fromDb(engine.utility.random.float(-6, -3))

  const synth = engine.audio.synth.createSimple({
    detune,
    frequency,
    type: 'square',
  }).filtered({
    detune: 1600 + detune,
    frequency: frequency * 2,
  }).connect(this.bus)

  synth.param.gain.setValueAtTime(engine.const.zeroGain, when)
  synth.param.gain.exponentialRampToValueAtTime(gain, when + 1/16)
  synth.param.gain.exponentialRampToValueAtTime(gain/16, when + 1/2)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + 1)

  synth.param.detune.setValueAtTime(detune, when + 1/8.5)
  synth.param.detune.linearRampToValueAtTime(detune + 1600, when + 1/8)

  synth.filter.frequency.exponentialRampToValueAtTime(frequency * 8, when + 1/2)

  synth.stop(when + 1)

  return synth
}

content.audio.sfx.coins = function (count = 1) {
  const now = engine.audio.time()
  let when = now

  for (let i = 0; i < count; i += 1) {
    if (when > now + 1) {
      break;
    }

    this.coin(when)
    when += Math.max(1/32, engine.utility.random.float(1/(count - i)/2, 1/(count - i)))
  }

  return this
}

content.audio.sfx.death = function (when = engine.audio.time()) {
  const duration = 3,
    gain = engine.utility.fromDb(-9)

  const synth = engine.audio.synth.createSimple({
    detune: engine.utility.random.float(-100, 100),
    frequency: 880,
    type: 'triangle',
  }).connect(this.bus)

  synth.param.gain.linearRampToValueAtTime(gain, when + duration/2)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

  synth.stop(when + duration)

  return synth
}

content.audio.sfx.draw = function (when = engine.audio.time()) {
  const duration = engine.utility.random.float(0.35, 0.4),
    frequency = engine.utility.random.float(8000, 10000)

  const synth = engine.audio.synth.createAmBuffer({
    buffer: engine.audio.buffer.noise.brown(),
    carrierGain: 1/2,
    modDepth: 1/2,
    modFrequency: 3 / duration,
    modType: 'sawtooth',
  }).filtered({
    frequency,
  }).connect(this.bus)

  synth.param.gain.linearRampToValueAtTime(1, when + 1/81)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

  synth.filter.frequency.exponentialRampToValueAtTime(frequency / 2, when + duration)

  synth.stop(when + duration)

  return synth
}

content.audio.sfx.experience = function ({
  duration = 1,
  from = 0,
  to = 0,
  when = engine.audio.time(),
}) {
  const frequency = engine.utility.midiToFrequency(45)

  const synth = engine.audio.synth.createAm({
    carrierGain: 3/4,
    carrierType: 'triangle',
    carrierFrequency: frequency,
    modDepth: 1/4,
    modFrequency: 8,
    modType: 'sine',
  }).filtered({
    frequency: frequency * 4,
  }).connect(this.bus)

  synth.param.gain.linearRampToValueAtTime(1, when + 1/32)
  synth.param.gain.setValueAtTime(1, when + duration - 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

  const currentLevel = content.level.calculateLevelFrom(from),
    currentLevelExperience = content.level.calculateExperienceTo(currentLevel),
    nextLevel = currentLevel + 1,
    nextLevelExperience = content.level.calculateExperienceTo(nextLevel)

  const fromDetune = engine.utility.scale(from, currentLevelExperience, nextLevelExperience, 0, 1200),
    toDetune = engine.utility.scale(to, currentLevelExperience, nextLevelExperience, 0, 1200)

  synth.param.detune.setValueAtTime(fromDetune, when)
  synth.param.detune.linearRampToValueAtTime(toDetune, when + duration)

  synth.stop(when + duration)

  return synth
}

content.audio.sfx.horn = function ({
  frequency,
  off, // XXX: Must be at least when + 1/16
  when,
}) {
  const humanize = engine.utility.random.float(0, 1/64)
  off += humanize
  when += humanize

  const detune = engine.utility.random.float(-10, 10),
    gain = engine.utility.fromDb(engine.utility.random.float(-4.5, -3))

  const attack = 1/64,
    decay = 3/64,
    release = 1/16,
    sustain = 1

  const synth = engine.audio.synth.createFm({
    carrierDetune: detune,
    carrierFrequency: frequency,
    carrierType: 'sawtooth',
    modDepth: frequency * 2,
    modDetune: detune,
    modFrequency: frequency,
    modType: 'triangle',
    when,
  }).filtered({
    detune,
    frequency: frequency * 4,
  }).connect(this.bus)

  const attackTime = when + attack,
    decayTime = attackTime + decay,
    sustainTime = decayTime + sustain

  synth.param.gain.setValueAtTime(engine.const.zeroGain, when)
  synth.param.gain.linearRampToValueAtTime(gain, attackTime)
  synth.param.gain.exponentialRampToValueAtTime(gain/2, decayTime)

  const endGain = gain * engine.utility.clamp(engine.utility.scale(off, decayTime, sustainTime, 1/3, 2/3), 1/3, 2/3)

  synth.param.gain.linearRampToValueAtTime(endGain, off)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, off + release)

  synth.param.detune.linearRampToValueAtTime(0, off)
  synth.param.mod.depth.exponentialRampToValueAtTime(frequency / 2, decayTime)

  synth.stop(off + release)

  return synth
}

content.audio.sfx.level = function (when = engine.audio.time()) {
  const frequencies = [69, 73, 76].map(engine.utility.midiToFrequency)

  for (const frequency of frequencies) {
    this.horn({
      frequency,
      off: when + 1/16,
      when,
    })

    this.horn({
      frequency,
      off: when + 7/8,
      when: when + 1/8,
    })
  }
}

content.audio.sfx.shuffle = function (when = engine.audio.time()) {
  const duration = engine.utility.random.float(0.7, 0.8),
    frequency = engine.utility.random.float(8000, 10000),
    modFrequency = engine.utility.random.float(20, 24)

  const synth = engine.audio.synth.createAmBuffer({
    buffer: engine.audio.buffer.noise.pink(),
    carrierGain: 1,
    modDepth: 0,
    modFrequency,
    modType: 'triangle',
  }).filtered({
    frequency,
  }).connect(this.bus)

  synth.param.gain.linearRampToValueAtTime(1, when + duration/2)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

  synth.param.carrierGain.linearRampToValueAtTime(1/2, when + duration)
  synth.param.mod.depth.linearRampToValueAtTime(1/2, when + duration)
  synth.param.mod.frequency.linearRampToValueAtTime(4, when + duration)

  synth.filter.frequency.exponentialRampToValueAtTime(frequency / 4, when + duration)

  synth.stop(when + duration)
  this.draw(when + duration)

  return synth
}
