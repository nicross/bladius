app.utility.component = {}

app.utility.component.experience = (count = 1) => {
  return `<span class="c-experience">${count} <i aria-hidden="true" role="presentation" title="Experience">✹</i><span class="u-screenReader">experience</span></span>`
}

app.utility.component.gold = (count = 1) => {
  return `<span class="c-gold">${count} <i aria-hidden="true" role="presentation" title="Gold">◈</i><span class="u-screenReader">gold</span></span>`
}

app.utility.component.potion = (count = 1) => {
  return `<span class="c-potion">${count} <i  aria-hidden="true" role="presentation" title="Potion">✚</i><span class="u-screenReader">${count == 1 ? 'potion' : 'potions'}</span></span>`
}
