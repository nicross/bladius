app.component.prompt.gold = app.component.prompt.base.invent({
  onConstruct: function ({
    bonus,
    gold,
  }) {
    this.titleElement.innerHTML = 'Payment'
    this.subtitleElement.innerHTML = `Received ${app.utility.component.gold(gold)}`

    // TODO: Call out bonus?

    this.totalGold = document.createElement('div')
    this.totalGold.className = 'c-prompt--gold'
    this.totalGold.setAttribute('aria-description', 'Total gold')
    this.rootElement.appendChild(this.totalGold)

    const button = document.createElement('button')
    button.className = 'c-button c-prompt--next'
    button.innerHTML = 'Get Good'
    button.addEventListener('click', (e) => this.onConfirm(e))
    this.rootElement.appendChild(button)
  },
  onOpen: function () {
    content.audio.sfx.coins(this.options.gold)

    this.animate({
      duration: 1,
      from: content.gold.get() - this.options.gold,
      to: content.gold.get(),
    })
  },
  animate: function ({
    duration,
    from,
    to,
  } = {}) {
    const start = engine.loop.time()

    this.totalGold.setAttribute('aria-busy', 'true')

    const animation = () => {
      const progress = Math.min(1, (engine.loop.time() - start) / duration),
        value = Math.round(engine.utility.lerp(from, to, progress))

      this.totalGold.innerHTML = app.utility.component.gold(value)

      if (progress == 1) {
        this.totalGold.setAttribute('aria-busy', 'false')
        engine.loop.off('frame', animation)
      }
    }

    engine.loop.on('frame', animation)
  },
})
