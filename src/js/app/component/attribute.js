app.component.attribute = {}

app.component.attribute.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

app.component.attribute.prototype = {
  attach: function (element) {
    element.appendChild(this.rootElement)
    return this
  },
  construct: function ({
    attribute = {},
  } = {}) {
    engine.utility.pubsub.decorate(this)
    this.attribute = attribute

    this.rootElement = document.createElement('button')
    this.rootElement.className = 'c-attribute'
    this.rootElement.addEventListener('click', (e) => this.onClick(e))

    this.currentValueElement = document.createElement('div')
    this.currentValueElement.className = 'c-attribute--value c-attribute--value-current'
    this.rootElement.appendChild(this.currentValueElement)

    this.nextValueElement = document.createElement('div')
    this.nextValueElement.className = 'c-attribute--value c-attribute--value-next'
    this.rootElement.appendChild(this.nextValueElement)

    const name = document.createElement('h2')
    name.className = 'c-attribute--name'
    name.innerHTML = attribute.name
    this.rootElement.appendChild(name)

    const description = document.createElement('p')
    description.className = 'c-attribute--description'
    description.innerHTML = attribute.description
    description.id = app.utility.dom.generateUniqueId({prefix: 'attribute_'})
    this.rootElement.setAttribute('aria-describedby', description.id)
    this.rootElement.appendChild(description)

    this.update()

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

    this.update()

    return this
  },
  update: function () {
    const attribute = content.hero.attributes[this.attribute.key],
      level = attribute.getLevel()

    this.rootElement.setAttribute('aria-label', `${attribute.name}, Increase to ${level + 1}`)
    this.currentValueElement.innerHTML = level
    this.nextValueElement.innerHTML = level + 1

    return this
  },
}
