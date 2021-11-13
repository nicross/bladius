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
    engine.loop.on('frame', onFrame)

    const {bonus} = content.hero.attributes.compute()

    const experience = e.kills * bonus,
      gold = 1 * bonus

    content.experience.add(experience)
    content.gold.add(gold)
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
    const discrete = app.controls.discrete(),
      focused = app.utility.focus.get(root),
      isPrompt = focused && focused.matches('.c-prompt')

    // Confirm prompts even if not focused
    if (discrete.confirm || discrete.start) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return isPrompt
          ? onPromptConfirm()
          : focused.click()
      }
    }

    if (discrete.enter || discrete.space) {
      if (isPrompt) {
        return onPromptConfirm()
      }
    }

    // Prompt navigation
    if (discrete.up || discrete.left) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (discrete.down || discrete.right) {
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
