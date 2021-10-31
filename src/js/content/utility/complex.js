content.utility.complex = {}

content.utility.complex.create = function (options) {
  if (!isNaN(options)) {
    options = {x: options}
  }

  return Object.create(this.prototype).construct(options)
}

content.utility.complex.prototype = {
  construct: function ({
    x = 0,
    y = 0,
  } = {}) {
    this.x = x
    this.y = y

    return this
  },
  add: function ({
    x = 0,
    y = 0,
  } = {}) {
    return content.utility.complex.create({
      x: this.x + x,
      y: this.y + y,
    })
  },
  clone: function () {
    return content.utility.complex.create(this)
  },
  multiply: function ({
    x = 0,
    y = 0,
  } = {}) {
    return content.utility.complex.create({
      x: this.x*x - this.y*y,
      y: this.x*y + this.y*x,
    })
  },
  subtract: function ({
    x = 0,
    y = 0,
  } = {}) {
    return content.utility.complex.create({
      x: this.x - x,
      y: this.y - y,
    })
  },
}
