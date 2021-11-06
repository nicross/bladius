content.component.attribute.staminaRegen = content.component.attribute.register(
  content.component.attribute.base.invent({
    key: 'staminaRegen',
    name: 'Stamina Regeneration',
    isEnemy: true,
    isHero: true,
    isPublic: false,
    compute: function ({
      multiplier: mask = 1,
    } = {}) {
      // Recover quarter of total stamina per second
      return 0.25 * this.multiplier * mask
    },
  })
)
