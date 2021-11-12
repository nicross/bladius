app.component.prompt.win = app.component.prompt.base.invent({
  onConstruct: function ({
    kills = 0,
  } = {}) {
    this.titleElement.innerHTML = 'Victory'
    this.subtitleElement.innerHTML = `Defeated ${kills} ${kills == 1 ? 'Foe' : 'Foes'}`

    // TODO: Sound effect

    const button = document.createElement('button')
    button.className = 'c-button c-prompt--next'
    button.innerHTML = 'Get Paid'
    button.addEventListener('click', (e) => this.onConfirm(e))
    this.rootElement.appendChild(button)
  },
})
