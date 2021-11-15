content.audio.breathing = (() => {
  const bus = content.audio.createBus(),
    context = engine.audio.context()

  let formant = chooseFormant(),
    timer

  bus.gain.value = engine.utility.fromDb(-18)

  function chooseFormant() {
    return engine.utility.choose([
      engine.audio.formant.a,
      engine.audio.formant.e,
      engine.audio.formant.i,
      engine.audio.formant.o,
      engine.audio.formant.u,
    ], Math.random())()
  }

  function getValue() {
    const health = content.hero.health.getRatio(),
      stamina = content.hero.stamina.getRatio()

    return engine.utility.lerp(0.75, 0, stamina) + engine.utility.lerp(0.25, 0, health)
  }

  function pulse() {
    const value = getValue()

    const duration = engine.utility.lerpRandom([2, 1], [0.5, 0.25], value),
      gain = engine.utility.fromDb(engine.utility.lerpRandom([-3, -2], [-1, 0], value)),
      nextFormant = chooseFormant(),
      now = engine.audio.time()

    const synth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.brown(),
    }).chainAssign('talkbox', engine.audio.effect.createTalkbox({
      dry: 0,
      format0: engine.audio.formant.create(formant),
      formant1: engine.audio.formant.create(nextFormant),
      mix: 0,
      wet: 1,
    })).shaped(
      engine.audio.shape.crush6()
    ).connect(bus)

    synth.param.talkbox.mix.setValueAtTime(0, now)
    synth.param.talkbox.mix.linearRampToValueAtTime(1, now + duration)

    synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
    synth.param.gain.linearRampToValueAtTime(gain, now + duration/2)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

    synth.stop(now + duration)

    // Timer
    const delay = engine.utility.lerpRandom([1, 0.5], [0.125, 0], value),
      next = now + duration + delay

    timer = context.createConstantSource()
    timer.onended = pulse
    timer.start()
    timer.stop(next)

    formant = nextFormant
  }

  function stop() {
    if (!timer) {
      return
    }

    timer.ondended = null
    timer.stop()
    timer = null
  }

  return {
    reset: function () {
      formant = chooseFormant()
      stop()

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

engine.state.on('reset', () => content.audio.breathing.reset())
