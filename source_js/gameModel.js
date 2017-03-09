
function GameModel(piano, world) {

    var tempo;
    function setTempo(bpm) {
        tempo = bpm;
    }

    setTempo(240);

    var timeInBeat = 0;

    this.setTempo = setTempo;

    var musicBox = new MusicBox();
    var musicGen = new MusicGen();
    var lights = new Lights();

    function nextChord() {
        return musicGen.popNextChord();
    }

    function nextMelody() {
        return musicGen.generateMelody();
    }

    var projectiles = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
    var targets = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
    this.spawnProjectile = function(world, note) {
        var keyPos = piano.getKeyPosition(note);
        var projectile = new Projectile(20, note, 1000);
        projectile.spawn(world, keyPos.x, keyPos.y, -1);
        projectiles[note].push(projectile);
    };

    function spawnTarget(world, note) {
        var target = new Target(20, 30, PitchClassMapping.pitchClassToColor[note%12]);
        target.spawn(world, piano.getKeyPosition(note).x, 0, 0.05 + Math.random()/10);
        targets[note].push(target);
    }

    function targetsEmpty() {
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].length != 0) return false;
        }
        return true;
    }

    this.keyPressed = function(pianoKey) {
        const baseOctave = 60;
        if (!currentChord || currentChord.indexOf(pianoKey % 12) < 0) {
            piano.setKeysForbidden([pianoKey]);
            this.spawnProjectile(world, pianoKey);
            if (instantFeedback) {
                synth2.noteOn(baseOctave + pianoKey, 100);
            }
        } else {
            piano.setKeysActive([pianoKey]);
            this.spawnProjectile(world, pianoKey);
            if (instantFeedback) {
                synth1.noteOn(baseOctave + pianoKey, 100);
            }
        }
    };

    this.keyUp = function(pianoKey) {
        if (currentChord.indexOf(pianoKey) >= 0) {
            piano.setKeysNotice2([pianoKey]);
        }
        else {
            piano.setKeysNormal([pianoKey]);
        }
    };

    var currentChord = null;

    function update(dt, world) {
        if (!gameActive)
            return;
        timeInBeat += dt;

        if (Math.random() < 0.5) {
            var color;
            // var color = PitchClassMapping.pitchClassToColor[currentChord[Math.floor(Math.random() * currentChord.length)] % 12];
            //if (!color)
                color = '#ffffff';
            new BackgroundLine(2, (Math.random() * 400) + 50, color, 3000).spawn(world, Math.random() * width, 1);
        }

        for (var i = 0; i < 13; i++) {

            var targetHit = false;

            if (targets[i][0] && targets[i][0].body.state.pos.y > piano.y - piano.whiteKeyHeight/2) {
                targetHit = true;
            }
            if (projectiles[i][0] && projectiles[i][0].body.state.pos.y < 0) {
                projectiles[i].shift().body.life = 0;
            }

            if (projectiles[i][0] && targets[i][0] && targets[i][0].body.state.pos.y > projectiles[i][0].body.state.pos.y) {
                projectiles[i].shift().body.life = 0;
                targetHit = true;
            }
            if (targetHit) {
                var targetBody = targets[i].shift().body;
                targetBody.life = 0;
                var pos = targetBody.state.pos;

                var melody = nextMelody();
                musicBox.playMelody(melody);

                // pulse the lights
                lights.pulse(timeInBeat);

                for (var i = 0; i < 8; i++) {
                    var particle = Physics.body('rectangle', {
                        x: pos.x
                        ,y: pos.y
                        ,width: 30
                        ,height: 30
                        ,styles: {
                            fillStyle: targetBody.styles.fillStyle
                        }
                        ,treatment: 'kinematic'
                        ,angle: Math.random() * 2 * Math.PI
                        ,despawn: true
                        ,collision: false
                        ,life: 10000
                    });

                    particle.state.vel.x = (Math.random() - 0.5);
                    particle.state.vel.y = (Math.random()-0.5);
                    world.add(particle);
                }
            }

            if (targetsEmpty() && !musicBox.waitingForChordToStart()) {
                currentChord = nextChord();

                // push the last annoying key in there
                if (currentChord.indexOf(0) >= 0) {
                    currentChord.push(12);
                }

                musicBox.playChord(currentChord, function() {
                    piano.setKeysNormal();
                    piano.setKeysNotice(currentChord);
                    currentChord.forEach(function(note) {
                        spawnTarget(world, note);
                    });

                    // new chord new light color
                    lights.setRandomRGB();
                });
            }

        }

        // time counter reaches a new beat
        if (timeInBeat > 60000 / tempo) {
            timeInBeat -= 60000 / tempo;

            musicBox.nextBeat();
        }
    }

    musicBox.registerBeat4Listener(function() {
        for (var i = 0; i < targets.length; i++) {
            for (var j = 0; j < targets[i].length; j++) {2
                var pos = targets[i][j].body.state.pos;
                var style = targets[i][j].body.styles.fillStyle;
                var velY = targets[i][j].body.state.vel.y;

                for (var k = 0; k < 10; k++) {
                    var particle = Physics.body('rectangle', {
                        x: pos.x
                        ,y: pos.y
                        ,width: 10
                        ,height: 10
                        ,styles: {
                            fillStyle: style
                        }
                        ,treatment: 'kinematic'
                        ,angle: Math.random() * 2 * Math.PI
                        ,despawn: true
                        ,collision: false
                        ,life: Math.random() * 1000
                    });

                    particle.state.vel.x = (Math.random() - 0.5) / 4;
                    particle.state.vel.y = (Math.random()-0.5) / 2 + velY;
                    world.add(particle);
                }
            }
        }
    });

    this.update = update;
}

