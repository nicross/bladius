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
  compute: function () {
    this.value = Math.max(this.level + this.modifier, 0) * this.multiplier
    return this
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
    this.compute()

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

    this.compute()

    return this
  },
  setLevel: function (level = 0) {
    this.level = level
    this.compute()

    return this
  },
  setModifier: function (modifier = 0) {
    this.multiplier = modifier
    this.compute()

    return this
  },
  setMultiplier: function (multiplier = 1) {
    this.multiplier = multiplier
    this.compute()

    return this
  },
}
