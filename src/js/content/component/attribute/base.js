content.component.attribute.base = {
  key: '',
  name: '',
  isEnemy: false,
  isHero: false,
  isPublic: false,
  construct: function ({
    ...values
  } = {}) {
    this.set(values)

    return this
  },
  compute: () => 0,
  computeLinear: function ({
    base = 0,
    increment = 0,
    mask = {},
  }) {
    const {
      level: maskLevel = 0,
      modifier: maskModifier = 0,
      multiplier: maskMultiplier = 1,
    } = mask

    const level = this.level + maskLevel + this.modifier + maskModifier,
      modifier = increment * level,
      multiplier = this.multiplier * maskMultiplier

    return (base + modifier) * multiplier
  },
  getLevel: function () {
    return this.level
  },
  getModifier: function () {
    return this.modifier
  },
  getMultiplier: function () {
    return this.multiplier
  },
  getValue: function () {
    return this.value
  },
  incrementLevel: function () {
    this.level += 1
    this.value = this.compute()

    return this
  },
  instantiate: function (...args) {
    return Object.create(this).construct(...args)
  },
  invent: function (definition = {}) {
    if (typeof definition == 'function') {
      definition = definition(this)
    }

    return Object.setPrototypeOf({...definition}, this)
  },
  set: function ({
    level = 0,
    modifier = 0,
    multiplier = 1,
  } = {}) {
    this.level = level
    this.modifier = modifier
    this.multiplier = multiplier

    this.value = this.compute()

    return this
  },
  setLevel: function (level = 0) {
    this.level = level
    this.value = this.compute()

    return this
  },
  setModifier: function (modifier = 0) {
    this.multiplier = modifier
    this.value = this.compute()

    return this
  },
  setMultiplier: function (multiplier = 1) {
    this.multiplier = multiplier
    this.value = this.compute()

    return this
  },
}
