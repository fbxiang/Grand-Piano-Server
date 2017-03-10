var ChordToNotesMapping = {
    i: [0, 3, 7],
    I: [0, 4, 7],
    ii: [2, 5, 9],
    II: [2, 6, 9],
    iii: [4, 7, 11],
    III: [4, 8, 11],
    iv: [0, 5, 8],
    IV: [0, 5, 9],
    V: [2, 7, 11],
    vi_sus4: [2, 4, 9],
    vi: [0, 4, 9],
    VI: [1, 4, 9],
    vii_dim: [2, 5, 11],
    VII_flat: [2, 5, 10]
};

function chordToRootMapping(chordName) {
    const chordToRootMapping = {
        i: 0,
        I: 0,
        ii: 2,
        II: 2,
        iii: 4,
        III: 4,
        iv: 5,
        IV: 5,
        v: 7,
        V: 7,
        vi: 9,
        VI: 9,
        vii: 11,
        VII: 11
    };

    var root = chordToRootMapping[chordName.split('_')[0]];
    return root ? root : 0;
}

var chordToMelodyNotesMapping = {
    i: {c: [0, 3, 7], d: [2, 5, 11], t:[]},
    I: {c: [0, 4, 7], d: [2, 9, 11], t:[]},
    ii: {c:[2, 5, 9], d: [0, 4, 7], t:[11]},
    II: {c: [2, 6, 9], d: [0, 4, 7], t:[11]},
    iii: {c: [4, 7, 11], d: [0, 2, 5, 9], t:[]},
    III: {c: [2, 4, 8, 11], d: [0, 5, 7, 9], t:[]},
    iv: {c: [0, 5, 8], d: [2, 4, 7], t:[11]},
    IV: {c: [0, 5, 9], d: [2, 4, 7], t:[11]},
    V: {c: [2, 7, 11], d: [0, 4, 9], t:[]},
    vi_sus4: {c: [2, 4, 9], d: [0, 5, 7], t:[11]},
    vi: {c: [0, 4, 9], d: [2, 7], t:[11]},
    VI: {c: [1, 4, 9], d: [2, 7], t:[11]},
    vii_dim: {c: [2, 5, 11], d: [0, 4, 9], t:[]},
    VII_flat: {c: [2, 5, 10], d: [6], t:[]}
};

function getNotesInRange(notes, low, high) {
    var allNotes = [];
    notes.forEach(function (note) {
        while (note <= high) {
            if (note >= low) {
                allNotes.push(note);
            }
            note += 12
        }
    });
    return allNotes.sort();
}

var repeatProgression = [
    {chords: ['I', 'vi', 'IV', 'V'], repeat: true, next:['I', 'vi']} //, keyChange: 1}
    ,{chords: ['I', 'IV', 'vi', 'IV', 'V'], repeat: true, next: ['I']}
    ,{chords: ['vi', 'V', 'IV', 'III'], repeat: true, next: ['vi']}
    ,{chords: ['I', 'V', 'vi', 'IV'], repeat: true, next:['I']}
    ,{chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'ii', 'V'], repeat: true, next:['I']}
    ,{chords: ['vi', 'vi', 'II', 'II'], repeat: true, next:['vi', 'I']}
    ,{chords: ['vi', 'IV', 'V', 'I'], repeat: true, next: ['vi', 'I']}
    ,{chords: ['vi', 'IV', 'V', 'iii'], repeat: true, next:['vi', 'I']}
    ,{chords: ['vi', 'iii', 'IV', 'I', 'ii', 'vi', 'vii_dim', 'III'], repeat: true, next:['vi']}
    ,{chords: ['vi', 'ii', 'V', 'vi', 'V', 'vi', 'vi', 'ii', 'V', 'vi', 'IV', 'V', 'vi_sus4', 'vi', 'vii_dim', 'vi'], repeat: false, next:['vi']}
    ,{chords: ['vi', 'V', 'I', 'iii'], repeat: true, next:['vi']}
];

var modulationProgression = [
     {chords: ['vi', 'ii', 'iii', 'vi_sus4'], repeat: false, next: ['I'], keyChange: 9}
    ,{chords: ['I', 'VI', 'II'], repeat: true, next: ['I'], keyChange: 7}
];

Array.prototype.randomOne = function() {
    if (this.length == 0) return null;
    return this[Math.floor(Math.random() * this.length)]
};

Array.prototype.shuffle = function() {
    var j, x, i;
    for (i = this.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = this[i - 1];
        this[i - 1] = this[j];
        this[j] = x;
    }
    return this;
};

var melodyPatterns = [
    ['c', 'c+', 'c+', 'c+']
    ,['c', 'c-', 'c-', 'c-']
    ,['c', 'c-', 'c+', 'c+']
    ,['c', 't+', 'c+t', 'c+']
    ,['c', 't-', 'c-t', 'c+']
    ,['c', 'c+j', 'd-', 'c-']
    ,['c', '', 'c-', 'c-']
    ,['c', '', 'c-', 'c+']
    ,['c', '', 'c-', '']
    ,['c', 'c+', 'c-', '']
    ,['c', 'c-', 'c-', '']
    ,['c', 'c-', 'c+', '']
    ,['c', 'c-j', 't+', 'c+']
    ,['c', 't+', 'c-', 'c-']
    ,['c', 'c+', 't+', 'c+']
];

function compilePatterns(melodyPatterns) {
    var patternBase = {};
    melodyPatterns.forEach(function(pattern) {
        var currentPatternBase = patternBase;
        pattern.forEach(function(singlePattern) {
            if (!currentPatternBase.hasOwnProperty(singlePattern)) {
                currentPatternBase[singlePattern] = {};
            }
            currentPatternBase = currentPatternBase[singlePattern];
        })
    });
    return patternBase;
}

var compiledPatterns = compilePatterns(melodyPatterns);

function searchForNoteInRange(notes, low, high) {
    var candidates = notes.filter(function(n) { return low<= n && n <= high });
    if (candidates.length == 0) return null;
    return candidates.randomOne();
}

function generateNextNoteBasedOnPattern(consonants, dissonants, transitions, note, pattern) {
    if (pattern == 'c') return note;

    var noteArray;
    if (pattern.includes('c')) {
        noteArray = consonants;
    }
    else if (pattern.includes('d')) {
        noteArray = dissonants;
    }
    else if (pattern.includes('t')) {
        noteArray = dissonants.concat(transitions);
    }
    else {
        // a rest!
        return -1;
    }

    var low;
    var high;

    if (pattern.includes('t')) {
        if (pattern.includes('+')) {
            low = note + 1;
            high = note + 2;
        }
        if (pattern.includes('-')) {
            high = note - 1;
            low = note - 2;
        }
    }
    else if (pattern.includes('j')) {
        if (pattern.includes('+')) {
            low = note + 5;
            high = note + 12;
        }
        if (pattern.includes('-')) {
            high = note - 5;
            low = note - 12;
        }
    }
    else {
        if (pattern.includes('+')) {
            low = note + 1;
            high = note + 4;
        }
        if (pattern.includes('-')) {
            high = note - 1;
            low = note - 4;
        }
    }

    var newNote = searchForNoteInRange(noteArray, low, high);

    if (newNote == null) return null;
    return newNote;
}

function recursiveGenFromPatterns(consonants, dissonants, transitions, patternBase, note) {
    if (patternBase == null) return [];
    var patterns = Object.keys(patternBase).shuffle();
    if (patterns.length == 0) return [];

    for (var i = 0; i < patterns.length; i++) {
        var pattern = patterns[i];
        var newNote = generateNextNoteBasedOnPattern(consonants, dissonants, transitions, note, pattern);
        if (newNote == null) continue;
        var subMelody = recursiveGenFromPatterns(consonants, dissonants, transitions, patternBase[pattern], newNote == -1 ? note : newNote);
        if (subMelody != null) return [newNote].concat(subMelody);
    }
    return null;
}

function generateMelodyBasedOnPatterns(consonants, dissonants, transitions, lastNote) {
    var note = consonants.filter(function(n) {return lastNote-4 <= n && n <= lastNote + 4}).randomOne();
    if (note == null) note = consonants.randomOne();

    var melody = recursiveGenFromPatterns(consonants, dissonants, transitions, compiledPatterns, note);

    // if (melody)
    //     // // console.log('melody', melody, 'generated by magic');
    // else {
    //     // // console.log('melody generation failed??')
    // }
    return melody;
}


function MusicGen() {
    var key = 0;
    var thisProgression;
    var repeatTimes = 0;

    // chord queue stores chords in the format [[0,4,7], 2] where [0,4,7] is the chord notes and 2 is the key (D)
    var chordQueue = [];
    var currentChord = null;

    var progressionsSinceLastModulation = 0;
    // helper function to randomly select chords
    function generateRandomRepeatProgression(firstChords, params) {
        progressionsSinceLastModulation += 1;
        return repeatProgression.filter(function(p) {
            return (!firstChords) || firstChords.includes(p.chords[0]);
        }).randomOne();
    }

    function generateRandomModulation(firstChords, params) {
        // // console.log('try to modulate');
        var progression = modulationProgression.filter(function(p) {
            return (!firstChords) || firstChords.includes(p.chords[0]);
        }).randomOne();

        if (progression != null)
            progressionsSinceLastModulation = 0;
        else {
            // // console.log('modulation failed');
        }
        return progression;
    }

    function generateRandomProgression(firstChords, params) {
        if (Math.random() < (progressionsSinceLastModulation - 3) / 6 ) {
            var output = generateRandomModulation(firstChords, params);
            if (output == null) output = generateRandomRepeatProgression(firstChords, params);
            return output;
        }
        return generateRandomRepeatProgression(firstChords, params);
    }

    // add more chords from the proper progression to the chord queue
    function generateNextProgression() {
        var newProgression = null;

        if (!thisProgression) {
            newProgression = generateRandomProgression()
        }
        else if (thisProgression.repeat) {
            if (repeatTimes >= 2 || Math.random() < 0.3 ) {
                repeatTimes = 0;
                newProgression = generateRandomProgression(thisProgression.next)
            }
            else {
                repeatTimes += 1;
                progressionsSinceLastModulation += 1;
                newProgression = thisProgression;
            }
        }
        else {
            repeatTimes = 0;
            newProgression = generateRandomProgression(thisProgression.next)
        }

        key = key + ((thisProgression && thisProgression.keyChange) ? thisProgression.keyChange : 0);
        // // console.log('change to', key);

        // // console.log('new progression appended:', newProgression);
        chordQueue = chordQueue.concat(newProgression.chords.map(function(chord) {return [chord, key]}));

        thisProgression = newProgression;
    }

    // have a look at the next chord
    // this.peekNextChord = function() {
    //     if (chordQueue.length == 0) {
    //         generateNextProgression();
    //     }
    //     return ChordToNotesMapping[chordQueue[0][0]].map(function(note) {
    //         return (note + chordQueue[0][1]) % 12;
    //     });
    // };

    this.popNextChord = function(callback) {
        if (chordQueue.length == 0) {
            generateNextProgression();
        }
        currentChord = chordQueue.shift();

        var chord = ChordToNotesMapping[currentChord[0]].map(function(note) {
            return (note + currentChord[1]) % 12;
        });

        var chordRoot = chordToRootMapping(currentChord[0]);
        callback(chord, chordRoot);
        return chord;
    };

    var lastNote = null;
    this.generateMelody = function() {

        function generateBasedOnchord () {
            var length = 4;
            var melody = [];
            var notes = ChordToNotesMapping[currentChord[0]].map(function (note) {
                return (note + currentChord[1]) % 12;
            });
            var allNotes = getNotesInRange(notes, 60, 84);

            var lastNote = null;
            for (var i = 0; i < length; i++) {
                // odd can be a rest
                if (i % 2 == 1 && Math.random() < 0.5) {
                    melody.push(-1);
                }
                else {
                    var goodNotes = allNotes.filter(function (n) {
                        return (!lastNote || Math.abs(n - lastNote) < 10)
                    });
                    if (goodNotes.length > 0) {
                        melody.push(goodNotes.randomOne());
                    }
                    else {
                        melody.push(allNotes.randomOne());
                    }
                }
            }
            return melody;
        }


        // avoid crash
        try {
            var map = chordToMelodyNotesMapping[currentChord[0]];
            var consonants = map.c;
            var dissonants = map.d;
            var transitions = map.t;

            consonants = getNotesInRange(consonants.map(function (note) {
                return note + currentChord[1]
            }), 60, 84);
            dissonants = getNotesInRange(dissonants.map(function (note) {
                return note + currentChord[1]
            }), 60, 84);
            transitions = getNotesInRange(transitions.map(function (note) {
                return note + currentChord[1]
            }), 60, 84);

            var melody1, melody2;
            melody1 = generateMelodyBasedOnPatterns(consonants, dissonants, transitions, lastNote);
            if (melody1 == null) melody1 = generateBasedOnchord();

            melody2 = generateMelodyBasedOnPatterns(consonants, dissonants, transitions, melody1[melody1.length - 1]);
            if (melody2 == null) melody2 = generateBasedOnchord();

            var melody = melody1.concat(melody2);

            lastNote = melody[melody.length - 1];
            return melody;
        }
        catch (err) {
            // // console.log('error during melody generation:', err);
            return null;
        }
    }
}
