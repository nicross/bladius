app.component.card = {}

app.component.card.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

app.component.card.prototype = {
  attach: function (element) {
    element.appendChild(this.rootElement)
    return this
  },
  construct: function ({
    card = {},
    isButton = false,
  } = {}) {
    engine.utility.pubsub.decorate(this)
    this.card = card

    this.rootElement = document.createElement(isButton ? 'button' : 'div')
    this.rootElement.className = 'c-card'
    this.rootElement.tabIndex = 0
    this.rootElement.addEventListener('click', (e) => this.onClick(e))

    const type = document.createElement('p')
    type.className = 'c-card--type'
    type.innerHTML = card.type
    this.rootElement.appendChild(type)

    const name = document.createElement('p')
    name.className = 'c-card--name'
    name.innerHTML = card.name
    this.rootElement.appendChild(name)

    const effects = document.createElement('ul')
    effects.className = 'c-card--effects'
    this.rootElement.appendChild(effects)

    for (const [key, values] of Object.entries(card.attributes)) {
      const attribute = content.component.attribute[key]

      if (values.modifier) {
        const effect = document.createElement('li')
        effect.className = 'c-card--effect'
        effect.innerHTML = `${values.modifier > 0 ? '+' : ''}${values.modifier} ${attribute.name}`
        effects.appendChild(effect)
      }

      if (values.multiplier && values.multiplier != 1) {
        const effect = document.createElement('li')
        effect.className = 'c-card--effect'
        effect.innerHTML = `${attribute.name} ${Math.round(values.multiplier * 100)}%`
        effects.appendChild(effect)
      }
    }

    if (card.bonus) {
      const effect = document.createElement('li')
      effect.className = 'c-card--effect'
      effect.innerHTML = `Rewards <i aria-label="times">×</i>${1 + card.bonus}`
      effects.appendChild(effect)
    }

    const cost = document.createElement('p')
    cost.className = 'c-card--cost'
    cost.innerHTML = `${isButton ? 'Buy for ' : ''}${app.utility.component.gold(card.cost)}`
    this.rootElement.appendChild(cost)

    return this
  },
  destroy: function () {
    this.rootElement.remove()
    this.off()
    return this
  },
  onClick: function (e) {
    e.preventDefault()
    e.stopPropagation()

    this.emit('click')

    return this
  },
}