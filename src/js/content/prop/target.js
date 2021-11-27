content.prop.target = engine.prop.base.invent({
  onConstruct: function ({
    fighter,
  } = {}) {
    this.fighter = fighter

    // TODO: Create synth

    return this
  },
  onDestroy: function () {
    return this
  },
  onUpdate: function () {
    this.x = this.fighter.body.vector.x
    this.y = this.fighter.body.vector.y
    this.recalculate()

    // Update synth

    return this
  },
  retarget: function (fighter) {
    this.fighter = fighter

    // TODO: Ramp synth detune

    return this
  },
})
