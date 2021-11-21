content.prop.collision = engine.prop.base.invent({
  onConstruct: function ({
    cards = [],
    velocity = 0,
  } = {}) {
    const isDeflect = cards.length == 2
    let delay = 0

    for (const card of cards) {
      const rampMethod = card.action == 'attack' && isDeflect
        ? 'exponentialRampToValueAtTime'
        : 'linearRampToValueAtTime'

      this.createSynth({
        card,
        delay,
        rampMethod,
        velocity,
      })

      delay += engine.utility.random.float(1/48, 1/24)
    }

    engine.utility.timing.promise((1/2 + delay) * 1000).then(() => {
      engine.props.destroy(this)
    })

    return this
  },
  createSynth: function ({
    card,
    delay = 0,
    rampMethod = 'linear',
    velocity = 0,
  }) {
    const duration = 1/2,
      gain = engine.utility.fromDb(engine.utility.lerp(-3, 0, velocity)),
      now = engine.audio.time() + delay

    const synth = engine.audio.synth.createBuffer({
      buffer: this.generateBuffer(card),
      when: now,
    }).connect(this.output)

    synth.param.gain.exponentialRampToValueAtTime(gain, now + 1/32)
    synth.param.gain[rampMethod](engine.const.zeroGain, now + duration)

    synth.stop(now + duration)

    return synth
  },
  generateBuffer: function (card = {}) {
    const options = {
      duration: 1/2,
      exponent: 1,
      from: {
        color: card.sfx.from.color + engine.utility.random.float(-card.sfx.from.colorRadius, card.sfx.from.colorRadius),
        modulation: card.sfx.from.mod + engine.utility.random.float(-card.sfx.from.modRadius, card.sfx.from.modRadius),
      },
      pitch: card.sfx.pitch,
      to: {
        color: card.sfx.to.color + engine.utility.random.float(-card.sfx.to.colorRadius, card.sfx.to.colorRadius),
        modulation: card.sfx.to.mod + engine.utility.random.float(-card.sfx.to.modRadius, card.sfx.to.modRadius),
      },
    }

    return content.audio.buffer.generateSfx(options)
  },
})
