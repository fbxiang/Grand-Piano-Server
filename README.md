# Grand Piano Visualizer

The premise of this visualizer is to allow it to be streamed to some online website and then accessed from any computer that has sound output and a keyboard or midi input device.

## How it works

- Works in conjunction with [our homemade floor piano](https://github.com/SIGMusic/Grand-Piano) which is a MIDI device to play our simulation and is a 10 foot long piano with 13 keys.
- [Wireless lights](https://github.com/SIGMusic/aurora) are also connected to react to people pressing keys and when the music chord changes. They communicate with a Raspberry Pi through websockets.
- There are chord progressions built in where melodies based in the current chord are played. Each time a chord is completed, the chord changes along with the lights

# Technologies
1. Server
    - Heroku
2. Visualization Library
    - physics.js
3. Audio Library
    - timbre.js

# Run commands

1. `npm install`
2. `bower install`
3. `grunt`
