app.component.prompt.gold = app.component.prompt.base.invent({
  onConstruct: function ({
    bonus,
    gold,
  }) {
    this.titleElement.innerHTML = 'Payment'
    this.subtitleElement.innerHTML = `Received ${app.utility.component.gold(gold)}`

    // TODO: Call out bonus?
    // TODO: Display total gold?
    // TODO: Sound effect

    const button = this.titleElement = document.createElement('button')
    button.className = 'c-button c-prompt--next'
    button.innerHTML = 'Get Rest'
    button.addEventListener('click', (e) => this.onConfirm(e))
    this.rootElement.appendChild(button)
  },
})
