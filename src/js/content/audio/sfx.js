content.audio.sfx = {}

content.audio.sfx.bus = engine.audio.mixer.createBus()
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
