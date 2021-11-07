app.utility.component = {}

app.utility.component.experience = (count = 1) => {
  return `<span class="c-experience">${count} <i aria-label="experience" title="Experience">✹</i></span>`
}

app.utility.component.gold = (count = 1) => {
  return `<span class="c-gold">${count} <i aria-label="gold" title="Gold">◈</i></span>`
}

app.utility.component.potion = (count = 1) => {
  return `<span class="c-potion">${count} <i aria-label="${count == 1 ? 'potion' : 'potions'}" title="Potion">✚</i></span>`
}
