content.audio.buffer = (() => {
  const context = engine.audio.context(),
    sampleRate = 8000

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

  function generateSfx(input, duration) {
    input = content.utility.complex.create(input)

    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate),
      constant = input.clone(),
      data = buffer.getChannelData(0),
      length = data.length

    for (let i = 0; i < length; i += 1) {
      const magnitude = (input.x * input.x) + (input.y * input.y),
        result = input.clone()

      if (magnitude > 2) {
        result.x *= 2 / magnitude
        result.y *= 2 / magnitude
      }

      data[i] = engine.utility.clamp((result.x + result.y) / 2, 0, 1)
      input = fractal(input, constant)
    }

    return buffer
  }

  return {
    generateSfx: function ({
      color = 0,
      duration = 1,
      modulation = 0,
    } = {}) {
      return generateSfx({
        x: engine.utility.lerp(1.3, 1.67, modulation),
        y: engine.utility.lerp(0.01, 0.83, color),
      }, duration)
    },
  }
})()
