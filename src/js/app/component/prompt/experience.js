app.component.prompt.experience = app.component.prompt.base.invent({
  onConstruct: function ({
    bonus,
    experience,
  }) {
    const isLevelUp = content.hero.level.canLevelUp()

    this.titleElement.innerHTML = 'Progress'
    this.subtitleElement.innerHTML = `Gained ${app.utility.component.experience(experience)}`

    // TODO: Call out bonus?
    // TODO: Animated bar
    // TODO: Sound effect

    const button = document.createElement('button')
    button.className = 'c-button c-prompt--next'
    button.innerHTML = isLevelUp ? 'Level Up' : 'Visit Shop'
    button.addEventListener('click', (e) => this.onConfirm(e))
    this.rootElement.appendChild(button)
  },
})
