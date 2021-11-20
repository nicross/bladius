content.deck = content.component.deck.create()

engine.state.on('reset', () => content.deck.reset())
