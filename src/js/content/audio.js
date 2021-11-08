content.audio = {}

content.audio.bus = engine.audio.mixer.createBus()

content.audio.testRandom = () => {
  const options = {
    duration: engine.utility.random.float(1/6, 1/3),
    exponent: engine.utility.random.float(0.5, 2),
    from: {
      color: Math.random(),
      modulation: Math.random(),
    },
    pitch: Math.random(),
    to: {
      color: Math.random(),
      modulation: Math.random(),
    },
  }

  const buffer = content.audio.buffer.generateSfx(options)

  const synth = engine.audio.synth.createBuffer({
    buffer,
  }).connect(content.audio.bus)

  const now = engine.audio.time()

  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + options.duration)

  synth.stop(now + options.duration)

  return {
    options,
    synth,
  }
}
