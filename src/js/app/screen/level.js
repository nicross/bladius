app.screen.level = (() => {
  const components = []

  let root

  engine.ready(() => {
    root = document.querySelector('.a-level')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-level', onEnter)
    app.state.screen.on('exit-level', onExit)

    createAttributes()
  })

  function createAttributes() {
    const parent = root.querySelector('.a-level--attributes')
    parent.innerHTML = ''

    const attributes = content.hero.attributes.attributes.filter((attribute) => attribute.isPublic)
    attributes.sort((a, b) => a.name.localeCompare(b.name))

    for (const attribute of attributes) {
      const container = document.createElement('li')
      container.className = 'c-attributes--attribute'

      const component = app.component.attribute.create({
        attribute,
      }).attach(container)

      component.on('click', onAttributeClick.bind(component))

      parent.appendChild(container)
      components.push(component)
    }
  }

  function onAttributeClick() {
    const attribute = this.attribute

    content.level.levelUp()
    content.hero.attributes[attribute.key].incrementLevel()

    app.state.screen.dispatch('next')
  }

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    content.audio.sfx.level()
    updateAttributes()
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

    if (discrete.up || discrete.left) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (discrete.down || discrete.right) {
      return app.utility.focus.setNextFocusable(root)
    }
  }

  function updateAttributes() {
    for (const component of components) {
      component.update()
    }
  }

  return {}
})()
