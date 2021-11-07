app.component.prompt = {}

app.component.prompt.base = {
  attach: function (element) {
    element.appendChild(this.rootElement)
    return this
  },
  create: function (...args) {
    return Object.create(this).construct(...args)
  },
  construct: function (...args) {
    engine.utility.pubsub.decorate(this)

    this.rootElement = document.createElement('section')
    this.rootElement.className = 'c-prompt'
    this.rootElement.tabIndex = -1

    app.utility.focus.trap(this.rootElement)

    this.onConstruct(...args)

    return this
  },
  close: function () {
    this.rootElement.classList.remove('c-prompt-active')
    this.rootElement.classList.add('c-prompt-inactive')

    return engine.utility.timing.promise(0.5 * 1000)
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
  open: function () {
    this.rootElement.classList.add('c-prompt-active')
    this.focus()
    return this
  },
}
