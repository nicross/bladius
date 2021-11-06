content.component.attribute = (() => {
  const prototypes = []

  return {
    all: () => [...prototypes],
    register: function (prototype) {
      prototypes.push(prototype)
      return prototype
    },
  }
})()
