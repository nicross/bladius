engine.ready(() => {
  engine.loop.start()

  engine.audio.mixer.master.param.limiter.attack.value = 0.003
  engine.audio.mixer.master.param.limiter.gain.value = 1
  engine.audio.mixer.master.param.limiter.knee.value = 15
  engine.audio.mixer.master.param.limiter.ratio.value = 20
  engine.audio.mixer.master.param.limiter.release.value = 0.125
  engine.audio.mixer.master.param.limiter.threshold.value = -36

  engine.audio.mixer.auxiliary.reverb.setImpulse(engine.audio.buffer.impulse.medium())
  engine.audio.mixer.auxiliary.reverb.param.gain.value = engine.utility.fromDb(-6)

  engine.prop.base.fadeInDuration = engine.const.zeroTime
  engine.prop.base.fadeOutDuration = engine.const.zeroTime
})
