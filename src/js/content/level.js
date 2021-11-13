content.level = (() => {
  const curve = 2

  let level = 0

  function calculateExperienceTo(value) {
    let result = 0

    for (let i = 1; i <= value; i += 1) {
      result += curve * i
    }

    return result
  }

  function calculateLevelFrom(experience) {
    let i = 1

    while (experience >= curve * i) {
      experience -= curve * i
      i += 1
    }

    return i - 1
  }

  return {
    calculateExperienceTo,
    calculateLevelFrom,
    canLevelUp: function () {
      return content.experience.get() >= this.getExperienceToNext()
    },
    get: () => level,
    getExperienceToNext: () => calculateExperienceTo(level + 1),
    getExperienceToNextDelta: function () {
      const experience = content.experience.get(),
        next = this.getExperienceToNext()

      return Math.max(next - experience, 0)
    },
    levelUp: function () {
      if (!this.canLevelUp()) {
        return this
      }

      level += 1

      return this
    },
    reset: function () {
      level = 0
      return this
    },
  }
})()

engine.state.on('reset', () => content.level.reset())
