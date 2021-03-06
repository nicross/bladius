# Bladius
A roguelike game of gladiatorial combat with deckbuilding elements built with [syngen](https://github.com/nicross/syngen).

## How to play
There are a few ways to acquire Bladius:
- [Download or play in the browser on itch.io.](https://shiftbacktick.itch.io/bladius)
- [Download a release on GitHub.](https://github.com/nicross/bladius/releases)
- Clone this repository and build from source.

A [game manual](https://bladius.shiftbacktick.io/manual.html) has been provided to improve your success in Bladius.
There you will find a complete reference to the game, its controls, and its mechanics.
How long will you survive in the arena?

## Getting started
To get started, please  use [npm](https://nodejs.org) to install the required dependencies:
```sh
npm install
```

### Common tasks
Common tasks have been automated with [Gulp](https://gulpjs.com):

#### Build once
```sh
gulp build
```

#### Build continuously
```sh
gulp watch
```

#### Create distributables
```sh
gulp dist
```

#### Open in Electron
```sh
gulp electron
```

#### Build and open in Electron
```sh
gulp electron-build
```

### Start web server
```sh
gulp serve
```

### Start web server and build continuously
```sh
gulp dev
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |

## Credits
These fonts are free for noncommercial use and not covered by the license of this project:

- **Fira Mono** by Mozilla
- **MB-Element Brutalized** by Irina ModBlackmoon
- **Roboto** by Google

Thanks for playing!
