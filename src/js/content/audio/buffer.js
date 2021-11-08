content.audio.buffer = (() => {
  const context = engine.audio.context()

  function fractal(input, constant) {
    return input.multiply({
      x: (input.x * input.x) + (input.y * input.y),
    }).subtract(
      input.multiply({
        x: constant.x * constant.x,
        y: constant.y * constant.y,
      })
    )
  }

  function generateSfx({
    exponent,
    from,
    duration,
    sampleRate,
    to,
  }) {
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate),
      data = buffer.getChannelData(0),
      length = data.length

    let result = from.clone()

    for (let i = 0; i < length; i += 1) {
      const magnitude = (result.x * result.x) + (result.y * result.y),
        progress = i / length

      if (magnitude > 2) {
        result.x *= 2 / magnitude
        result.y *= 2 / magnitude
      }

      data[i] = engine.utility.clamp((result.x + result.y) / 2, 0, 1)

      const constant = content.utility.complex.create({
        x: engine.utility.lerpExp(from.x, to.x, progress, exponent),
        y: engine.utility.lerpExp(from.y, to.y, progress, exponent),
      })

      result = fractal(result, constant)
    }

    return buffer
  }

  function generateSfxSimple({
    duration,
    input,
    sampleRate,
  } = {}) {
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate),
      constant = input.clone(),
      data = buffer.getChannelData(0),
      length = data.length

    let result = input.clone()

    for (let i = 0; i < length; i += 1) {
      const magnitude = (result.x * result.x) + (result.y * result.y)

      if (magnitude > 2) {
        result.x *= 2 / magnitude
        result.y *= 2 / magnitude
      }

      data[i] = engine.utility.clamp((result.x + result.y) / 2, 0, 1)
      result = fractal(result, constant)
    }

    return buffer
  }

  function toComplex({
    color = 0,
    modulation = 0,
  } = {}) {
    return content.utility.complex.create({
      x: engine.utility.lerp(1.3, 1.67, modulation),
      y: engine.utility.lerp(0.01, 0.83, color),
    })
  }

  return {
    generateSfx: function ({
      duration = 1,
      exponent = 1,
      from, // {color, modulation}
      pitch = 1,
      to, // {color, modulation}, defaults to from
    } = {}) {
      from = toComplex(from)
      to = to ? toComplex(to) : from

      return generateSfx({
        duration,
        exponent,
        from,
        sampleRate: engine.utility.lerp(3000, 9000, pitch),
        to,
      })
    },
    generateSfxSimple: function ({
      color = 0,
      duration = 1,
      modulation = 0,
      pitch = 1,
    } = {}) {
      const input = toComplex({color, modulation})

      return generateSfxSimple({
        duration,
        input,
        sampleRate: engine.utility.lerp(3000, 9000, pitch),
      })
    },
  }
})()
