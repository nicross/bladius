content.level = (() => {
  let level = 0

  function calculateExperienceTo(level) {
    let result = 0

    for (let i = 1; i <= level; i += 1) {
      result += i
    }

    return result
  }

  return {
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
