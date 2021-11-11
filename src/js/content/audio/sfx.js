content.audio.sfx = {}

content.audio.sfx.bus = engine.audio.mixer.createBus()
content.audio.sfx.bus.gain.value = engine.utility.fromDb(0)

content.audio.sfx.coin = function (when = engine.audio.time()) {
  const note = 72

  const detune = engine.utility.random.float(-12.5, 12.5),
    frequency = engine.utility.midiToFrequency(note),
    gain = engine.utility.fromDb(-15)

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
