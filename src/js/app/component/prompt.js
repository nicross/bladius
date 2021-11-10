app.component.prompt = {}

app.component.prompt.base = {
  attach: function (element) {
    element.appendChild(this.rootElement)
    return this
  },
  create: function (...args) {
    return Object.create(this).construct(...args)
  },
  close: function () {
    this.rootElement.classList.remove('c-prompt-active')
    this.rootElement.classList.add('c-prompt-inactive')
    this.rootElement.setAttribute('aria-hidden', 'true')

    return engine.utility.timing.promise(1 * 1000)
  },
  construct: function (options) {
    engine.utility.pubsub.decorate(this)

    this.rootElement = document.createElement('section')
    this.rootElement.className = 'c-prompt c-screen'
    this.rootElement.tabIndex = -1
    this.rootElement.setAttribute('aria-hidden', 'true')

    this.headerElement = document.createElement('header')
    this.headerElement.className = 'c-screen--header'
    this.headerElement.id = app.utility.dom.generateUniqueId({prefix: 'prompt_'})
    this.rootElement.setAttribute('aria-labelledby', this.headerElement.id)
    this.rootElement.appendChild(this.headerElement)

    this.titleElement = document.createElement('h1')
    this.titleElement.className = 'c-screen--title'
    this.headerElement.appendChild(this.titleElement)

    this.subtitleElement = document.createElement('div')
    this.subtitleElement.className = 'c-screen--subtitle'
    this.headerElement.appendChild(this.subtitleElement)

    app.utility.focus.trap(this.rootElement)

    this.options = options
    this.onConstruct(options)

    return this
  },
  destroy: function () {
    this.rootElement.remove()
    this.off()
    return this
  },
  focus: function () {
    app.utility.focus.set(this.rootElement)
    return this
  },
  invent: function (definition = {}) {
    if (typeof definition == 'function') {
      definition = definition(this)
    }

    return Object.setPrototypeOf({...definition}, this)
  },
  onConfirm: function (e) {
    e.preventDefault()
    e.stopPropagation()

    this.emit('confirm')

    return this
  },
  onConstruct: () => {},
  onOpen: () => {},
  open: function () {
    this.rootElement.classList.add('c-prompt-active')
    this.rootElement.removeAttribute('aria-hidden')
    this.onOpen()
    setTimeout(() => this.focus(), 0)
    return this
  },
}
