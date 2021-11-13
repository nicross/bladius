app.component.prompt.experience = app.component.prompt.base.invent({
  onConstruct: function ({
    bonus,
    experience,
  }) {
    const isLevelUp = content.level.canLevelUp()

    this.titleElement.innerHTML = 'Progress'
    this.subtitleElement.innerHTML = `Gained ${app.utility.component.experience(experience)}`

    // TODO: Call out bonus?

    this.progressElement = document.createElement('progress')
    this.progressElement.className = 'c-prompt--experience'
    this.rootElement.appendChild(this.progressElement)

    const button = document.createElement('button')
    button.className = 'c-button c-prompt--next'
    button.innerHTML = isLevelUp ? 'Level Up' : 'Visit Shop'
    button.addEventListener('click', (e) => this.onConfirm(e))
    this.rootElement.appendChild(button)
  },
  onOpen: function () {
    const options = {
      duration: 1.5,
      from: content.experience.get() - this.options.experience,
      to: content.experience.get(),
    }

    content.audio.sfx.experience(options)
    this.animate(options)
  },
  animate: function ({
    duration,
    from,
    to,
  } = {}) {
    const start = engine.loop.time()

    this.progressElement.setAttribute('aria-busy', 'true')

    const animation = () => {
      const progress = Math.min(1, (engine.loop.time() - start) / duration),
        value = engine.utility.lerp(from, to, progress)

      const level = content.level.calculateLevelFrom(value),
        max = content.level.calculateExperienceTo(level + 1),
        min = content.level.calculateExperienceTo(level)

      // Snap to max if ending on a level up
      const ratio = progress == 1 && value == min
        ? 1
        : engine.utility.scale(value, min, max, 0, 1)

      this.progressElement.value = ratio

      if (progress == 1) {
        this.progressElement.setAttribute('aria-busy', 'false')
        engine.loop.off('frame', animation)
      }
    }

    engine.loop.on('frame', animation)
  },
})
