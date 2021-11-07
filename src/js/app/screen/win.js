app.screen.win = (() => {
  const prompts = []

  let root

  engine.ready(() => {
    root = document.querySelector('.a-win')

    app.utility.focus.trap(root)

    app.state.screen.on('enter-win', onEnter)
    app.state.screen.on('exit-win', onExit)
  })

  function createPrompts({
    bonus,
    experience,
    gold,
    kills,
  } = {}) {
    const parent = root.querySelector('.a-win--prompts')

    prompts.push(
      app.component.prompt.win.create({
        kills,
      })
    )

    prompts.push(
      app.component.prompt.gold.create({
        bonus,
        gold,
      })
    )

    prompts.push(
      app.component.prompt.experience.create({
        bonus,
        experience,
      })
    )

    // TODO: Statistics?

    for (const prompt of prompts) {
      prompt.on('confirm', onPromptConfirm)
      prompt.attach(parent)
    }

    prompts[0].open()
  }

  function onEnter(e) {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    const {bonus} = content.hero.attributes.compute()

    const experience = e.kills * bonus,
      gold = 1 * bonus

    content.hero.experience.add(experience)
    content.hero.gold.add(gold)
    content.round.increment()

    createPrompts({
      bonus,
      experience,
      gold,
      ...e,
    })
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const ui = app.controls.ui()

    // Confirm prompts even if not focused
    if (ui.confirm || ui.start) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.matches('.c-prompt')
          ? onPromptConfirm()
          : focused.click()
      }
    }

    if (ui.enter || ui.space) {
      const focused = app.utility.focus.get(root)

      if (focused && focused.matches('.c-prompt')) {
        onPromptConfirm()
      }
    }

    // Prompt navigation
    if (ui.up || ui.left) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (ui.down || ui.right) {
      return app.utility.focus.setNextFocusable(root)
    }
  }

  function onPromptConfirm() {
    const current = prompts.shift(),
      next = prompts[0]

    current.close().then(() => current.destroy())

    if (next) {
      next.open()
    } else {
      app.state.screen.dispatch('next')
    }
  }

  return {}
})()
