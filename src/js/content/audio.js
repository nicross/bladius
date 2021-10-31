content.audio = {}

content.audio.bus = engine.audio.mixer.createBus()

content.audio.test = ({
  color = 0.5,
  duration = 1,
  modulation = 0.5,
} = {}) => {
  const buffer = content.audio.buffer.generateSfx({
    color,
    duration,
    modulation,
  })

  const synth = engine.audio.synth.createBuffer({
    buffer,
  }).connect(content.audio.bus)

  const now = engine.audio.time()

  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)

  return synth
}
