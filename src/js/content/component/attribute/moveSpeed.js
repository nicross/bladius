content.component.attribute.moveSpeed = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'moveSpeed',
    name: 'Movement Speed',
    isEnemy: true,
    isHero: true,
    compute: function ({
      multiplier: mask = 1,
    } = {}) {
      // Base walk speed is 2.5 m/s, sprinting doubles this
      return 2.5 * this.multiplier * mask
    },
  })
)
