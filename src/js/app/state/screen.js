app.state.screen = engine.utility.machine.create({
  state: 'none',
  transition: {
    none: {
      ready: function () {
        this.change('splash')
      },
    },
    splash: {
      start: function () {
        this.change('booster')
      },
    },
    booster: {
      next: function () {
        this.change('draw')
      },
    },
    draw: {
      next: function () {
        this.change('fight')
      },
    },
    fight: {
      loss: function () {
        this.change('loss')
      },
      win: function () {
        this.change('win')
      },
    },
    loss: {
      restart: function () {
        this.change('booster')
      },
    },
    win: {
      next: function () {
        // TODO
        const isLevelUp = false
        this.change(isLevelUp ? 'level' : 'store')
      },
    },
    level: {
      next: function () {
        this.change('store')
      },
    },
    store: {
      next: function () {
        // TODO
        const isBooster = false
        this.change(isBooster ? 'booster' : 'draw')
      },
    },
  },
})

engine.ready(() => {
  [...document.querySelectorAll('.a-app--screen')].forEach((element) => {
    element.setAttribute('aria-hidden', 'true')
    element.setAttribute('role', 'persentation')
  })

  app.state.screen.dispatch('ready')
})

app.state.screen.on('exit', (e) => {
  const active = document.querySelector('.a-app--screen-active')
  const inactive = document.querySelector('.a-app--screen-inactive')

  if (active) {
    active.classList.remove('a-app--screen-active')
    active.classList.add('a-app--screen-inactive')
    active.setAttribute('aria-hidden', 'true')
    active.setAttribute('role', 'persentation')
  }

  if (inactive) {
    inactive.classList.remove('a-app--screen-inactive')
    inactive.hidden = true
  }

  engine.input.gamepad.reset()
  engine.input.keyboard.reset()
  engine.input.mouse.reset()
})

app.state.screen.on('enter', (e) => {
  const selectors = {
    booster: '.a-app--booster',
    draw: '.a-app--draw',
    fight: '.a-app--fight',
    level: '.a-app--level',
    loss: '.a-app--loss',
    splash: '.a-app--splash',
    store: '.a-app--store',
    win: '.a-app--win',
  }

  const selector = selectors[e.currentState]
  const element = document.querySelector(selector)

  element.classList.add('a-app--screen-active')
  element.removeAttribute('aria-hidden')
  element.removeAttribute('role')
  element.removeAttribute('hidden')
})
