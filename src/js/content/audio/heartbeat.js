content.audio.heartbeat = (() => {
  const bus = content.audio.createBus(),
    context = engine.audio.context(),
    f1 = engine.utility.midiToFrequency(33),
    f2 = engine.utility.midiToFrequency(36)

  let timer

  bus.gain.value = engine.utility.fromDb(-13.5)

  function getValue() {
    const health = content.hero.health.getRatio(),
      stamina = content.hero.stamina.getRatio()

    return engine.utility.lerp(0.75, 0, health) + engine.utility.lerp(0.25, 0, stamina)
  }

  function pulse() {
    const value = getValue()

    const bpm = engine.utility.lerp(60, 240, value),
      duration = 1 / (bpm / 60),
      gain = engine.utility.fromDb(engine.utility.lerpRandom([-3, -2], [-1, 0]), value),
      now = engine.audio.time(),
      rampDuration = 1/32,
      s1Duration = duration / 3,
      s1Gain = engine.utility.humanizeDb(gain / 1.5, -12),
      s2Duration = duration / 2,
      s2Gain = engine.utility.humanizeDb(gain, -12)

    const endTime = now + s1Duration + s2Duration

    const synth = engine.audio.synth.createSimple({
      type: 'triangle',
    }).connect(bus)

    synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
    synth.param.gain.exponentialRampToValueAtTime(s1Gain, now + rampDuration)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + s1Duration - rampDuration)
    synth.param.gain.exponentialRampToValueAtTime(s2Gain, now + s1Duration)
    synth.param.gain.linearRampToValueAtTime(s2Gain/64, now + s1Duration + s2Duration/2)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, endTime)

    synth.param.frequency.setValueAtTime(f1, now)
    synth.param.frequency.setValueAtTime(f1, now + s1Duration - rampDuration)
    synth.param.frequency.exponentialRampToValueAtTime(f2, now + s1Duration)
    synth.param.frequency.exponentialRampToValueAtTime(f1, endTime)

    synth.stop(endTime)

    // Timer
    const next = now + duration

    timer = context.createConstantSource()
    timer.onended = pulse
    timer.start()
    timer.stop(next)
  }

  function stop() {
    if (!timer) {
      return
    }

    timer.onended = null
    timer.stop()
    timer = null
  }

  return {
    reset: function () {
      return this
    },
    start: function () {
      if (!timer) {
        pulse()
      }

      return this
    },
    stop: function () {
      stop()

      return this
    },
  }
})()

engine.state.on('reset', () => content.audio.heartbeat.reset())
