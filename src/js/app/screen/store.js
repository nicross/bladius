app.screen.store = (() => {
  const components = []

  let goldElement,
    potionButton,
    potionsElement,
    root

  engine.ready(() => {
    root = document.querySelector('.a-store')
    goldElement = root.querySelector('.a-store--gold')
    potionButton = root.querySelector('.a-store--potion')
    potionsElement = root.querySelector('.a-store--potions')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-store', onEnter)
    app.state.screen.on('exit-store', onExit)

    potionButton.addEventListener('click', onPotionClick)
    root.querySelector('.a-store--next').addEventListener('click', onNextClick)
  })

  function onCardClick() {
    const card = this.card

    if (this.isDisabled()) {
      return
    }

    content.deck.add(card)
    content.gold.spend(card.cost)
    updateGold()

    this.setDisabled(true)
  }

  function onEnter() {
    updateCards()

    goldElement.removeAttribute('aria-live')
    updateGold()
    goldElement.setAttribute('aria-live', 'assertive')

    potionsElement.removeAttribute('aria-live')
    updatePotions()
    potionsElement.setAttribute('aria-live', 'assertive')

    root.querySelector('.a-store--next').innerHTML = content.packs.canRedeem()
      ? 'Open Booster Pack'
      : 'Prepare to Fight'

    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const discrete = app.controls.discrete()

    if (discrete.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    if (discrete.left || discrete.right) {
      const leftRight = {
        '.c-cards': '.c-card',
        '.c-screen--actions': '.c-screen--action *',
      }

      for (const [parent, target] of Object.entries(leftRight)) {
        if (app.utility.focus.isWithin(root.querySelector(parent))) {
          if (discrete.left) {
            return app.utility.focus.setPreviousFocusable(root, (element) => {
              return element.matches(target)
            })
          }

          if (discrete.right) {
            return app.utility.focus.setNextFocusable(root, (element) => {
              return element.matches(target)
            })
          }
        }
      }
    }

    if (discrete.up) {
      return app.utility.focus.setPreviousFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) *')
      })
    }

    if (discrete.down) {
      return app.utility.focus.setNextFocusable(root, (element) => {
        return !element.matches('.c-cards--card:nth-child(n+2) *')
      })
    }
  }

  function onNextClick() {
    app.state.screen.dispatch('next')
  }

  function onPotionClick() {
    if (potionButton.getAttribute('aria-disabled') == 'true') {
      return
    }

    content.gold.spend(1)
    content.potions.add(1)

    updateGold()
    updatePotions()
  }

  function updateCards() {
    const cards = content.cards.generateStoreWares(),
      parent = root.querySelector('.a-store--cards')

    cards.sort((a, b) => b.cost - a.cost)

    // Destroy components
    for (const component of components) {
      component.destroy()
    }

    components.length = 0
    parent.innerHTML = ''

    // Build components
    for (const card of cards) {
      const container = document.createElement('li')
      container.className = 'c-cards--card'

      const component = app.component.card.create({
        card,
        isButton: true,
      }).attach(container)

      component.on('click', onCardClick.bind(component))
      components.push(component)

      parent.appendChild(container)
    }
  }

  function updateGold() {
    // Gold
    goldElement.innerHTML = app.utility.component.gold(content.gold.get())

    // Potion button
    potionButton.setAttribute('aria-disabled', !content.gold.has(1) ? 'true' : 'false')

    // Cards
    for (const component of components) {
      if (!component.isDisabled() && !content.gold.has(component.card.cost)) {
        component.setDisabled(true)
      }
    }
  }

  function updatePotions() {
    potionsElement.innerHTML = app.utility.component.potion(content.potions.get())
  }

  return {}
})()
