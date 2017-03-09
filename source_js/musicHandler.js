
var env = T("perc", {r:1000});
var synth1 = T("SynthDef", {mul:0.45, poly:4});
synth1.def = function(opts) {
    var op1 = T("sin", {freq:opts.freq*6, fb:0.25, mul:0.4});
    var op2 = T("sin", {freq:opts.freq, phase:op1, mul:0.4});
    return env.clone().append(op2).on("ended", opts.doneAction).bang();
};
synth1.play();

var synth2 = T("SynthDef", {mul:0.2, poly:4});
synth2.def = function(opts) {
    var op1 = T("sin", {freq:opts.freq*6, fb:0.25, mul:0.4});
    var op2 = T("sin", {freq:opts.freq, phase:op1, mul:0.4});
    return env.clone().append(op2).on("ended", opts.doneAction).bang();
};
synth2.play();



var mml = "l2 g0<c0e> f0g0<d> e0g0<c1";

var bass = T("OscGen", {wave:"sin(10)", env:{type:"adsr"}, mul:0.2}).play();

var bassEffect = T('chorus', {rate:4, fb: 0.5, mix: 0.25}, bass);
bassEffect = T("reverb", {room:0.95, damp:0.1, mix:0.75}, bassEffect);
bassEffect.play();

function MusicBox() {
    var beatCount = -1;

    var melodyQueue = [];
    var currentChord = null;

    var currentCallback = null;
    // music playing logic
    this.playChord = function(chord, switchCallback) {
        currentCallback = function() {
            currentChord = chord;
            switchCallback();
        };
    };

    this.playMelody = function(melody) {
        melodyQueue = melodyQueue.concat(melody);
    };

    this.nextBeat = function() {
        beatCount++;
        if (melodyQueue.length > 0)
            synth1.noteOn(melodyQueue.pop(), 80);

        if (beatCount % 4 == 0)
            this.onBeat4();
    };

    this.waitingForChordToStart = function() {
        return currentCallback != null;
    };

    var beat4Listener = null;
    this.onBeat4 = function() {
        // switch chord and call the switch callback
        if (currentCallback && beatCount % 8 == 0) {
            melodyQueue = [];
            currentCallback();
            currentCallback = null;
        }

        if (!currentChord) return;
        bass.allNoteOff();

        currentChord.forEach(function(noteClass) {
            bass.noteOn(noteClass + 48, 60);
        });

        beat4Listener && beat4Listener();

    };

    this.registerBeat4Listener = function(callback) {
        beat4Listener = callback;
    }
}
