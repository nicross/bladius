content.component.attributes = {}

content.component.attributes.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.component.attributes.prototype = {
  construct: function ({
    defaults = {},
    filter = () => true,
  } = {}) {
    const prototypes = content.component.attribute.all()

    this.attributes = []
    this.defaults = {...defaults}

    for (const prototype of prototypes) {
      if (!filter(prototype)) {
        continue
      }

      const key = prototype.key
      const attribute = prototype.instantiate(defaults[key])

      this[key] = attribute
      this.attributes.push(attribute)
    }

    return this
  },
  compute: function (mask = {}) {
    const result = {}

    for (const attribute of this.attributes) {
      const key = attribute.key
      result[key] = attribute.compute(mask[key])
    }

    return result
  },
  reset: function () {
    return this.set(this.defaults)
  },
  set: function (data = {}) {
    for (const attribute of this.attributes) {
      attribute.set(data[attribute.key])
    }

    return this
  },
  setWithHand: function (hand = {}) {
    return this.set(hand.attributes)
  },
  setLevels: function (values = {}) {
    for (const attribute of this.attributes) {
      attribute.setLevel(values[attribute.key])
    }

    return this
  },
  setModifiers: function (values = {}) {
    for (const attribute of this.attributes) {
      attribute.setModifier(values[attribute.key])
    }

    return this
  },
  setMultipliers: function (values = {}) {
    for (const attribute of this.attributes) {
      attribute.setMultiplier(values[attribute.key])
    }

    return this
  },
}
