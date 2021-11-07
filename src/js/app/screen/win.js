app.screen.win = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-win')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-win', onEnter)
    app.state.screen.on('exit-win', onExit)
  })

  function onEnter(e) {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    const {bonus} = content.hero.attributes.compute()

    const experience = e.kills * bonus,
      gold = 1 * bonus

    content.hero.experience.add(experience)
    content.hero.gold.add(gold)

    // TODO: Prompts
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const ui = app.controls.ui()

    if (ui.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    if (ui.up || ui.left) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (ui.down || ui.right) {
      return app.utility.focus.setNextFocusable(root)
    }
  }

  return {}
})()
