content.audio.kills = (() => {
  function onKill() {
    content.audio.sfx.kill()
  }

  return {
    onFighterAdd: function (fighter) {
      fighter.on('kill', onKill)
      return this
    },
    onFighterRemove: function (fighter) {
      fighter.off('kill', onKill)
      return this
    },
  }
})()

engine.ready(() => {
  content.fighters.on('add', (...args) => content.audio.kills.onFighterAdd(...args))
  content.fighters.on('remove', (...args) => content.audio.kills.onFighterRemove(...args))

  // XXX: Race condition, hero is defined before content.fighters add event is fired
  content.audio.kills.onFighterAdd(content.hero)
})
