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



var repeatProgression = [
     {chords: ['I', 'vi', 'IV', 'V'], repeat: true, next:['I', 'vi']} //, keyChange: 1}
    ,{chords: ['I', 'V', 'vi', 'IV'], repeat: true, next:['I']}
    ,{chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'ii', 'V'], repeat: true, next:['I']}
    ,{chords: ['vi', 'vi', 'II', 'II'], repeat: true, next:['vi', 'I']}
    ,{chords: ['vi', 'IV', 'V', 'I'], repeat: true, next: ['vi', 'I']}
    ,{chords: ['vi', 'IV', 'V', 'iii'], repeat: true, next:['vi', 'I']}
    ,{chords: ['vi', 'iii', 'IV', 'I', 'ii', 'vi', 'vii_dim', 'III'], repeat: true, next:['vi']}
    ,{chords: ['vi', 'ii', 'V', 'vi', 'V', 'vi', 'vi', 'ii', 'V', 'vi', 'IV', 'V', 'vi_sus4', 'vi', 'vii_dim', 'vi'], repeat: false, next:['vi']}
    ,{chords: ['vi', 'V', 'I', 'iii'], repeat: true, next:['vi']}
];

Array.prototype.randomOne = function() {
    return this[Math.floor(Math.random() * this.length)]
};

function MusicGen() {
    var key = 0;
    var thisProgression;
    var repeatTimes = 0;

    var chordQueue = [];
    var currentChord = null;

    // helper function to randomly select chords
    function generateRandomProgression(firstChords, params) {
        return repeatProgression.filter(function(p) {
            return (!firstChords) || firstChords.indexOf(p.chords[0] >= 0);
        }).randomOne();
    }

    // add more chords from the proper progression to the chord queue
    function generateNextProgression() {
        var newProgression = null;

        if (!thisProgression) {
            newProgression = generateRandomProgression()
        }
        else if (thisProgression.repeat) {
            if (repeatTimes >= 4 || (repeatTimes == 2 && Math.random() < 0.5)) {
                repeatTimes = 0;
                newProgression = generateRandomProgression(thisProgression.next)
            }
            else {
                repeatTimes += 1;
                newProgression = thisProgression;
            }
        }
        else {
            repeatTimes = 0;
            newProgression = generateRandomProgression(thisProgression.next)
        }

        console.log(repeatTimes);

        key = key + ((thisProgression && thisProgression.keyChange) ? thisProgression.keyChange : 0);

        console.log('new progression appended:', newProgression);
        chordQueue = chordQueue.concat(newProgression.chords.map(function(chord) {return [chord, key]}));

        thisProgression = newProgression;
    }

    // have a look at the next chord
    this.peekNextChord = function() {
        if (chordQueue.length == 0) {
            generateNextProgression();
        }
        return ChordToNotesMapping[chordQueue[0][0]].map(function(note) {
            return (note + chordQueue[0][1]) % 12;
        });
    };

    this.popNextChord = function() {
        if (chordQueue.length == 0) {
            generateNextProgression();
        }
        currentChord = chordQueue.shift();
        return ChordToNotesMapping[currentChord[0]].map(function(note) {
            return (note + currentChord[1]) % 12;
        });
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

    this.generateMelody = function(length, params) {
        (length) || (length = 8);
        var melody = [];
        var notes = ChordToNotesMapping[currentChord[0]].map(function(note) {
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
                var goodNotes = allNotes.filter(function(n) { return (!lastNote || Math.abs(n-lastNote) <10) });
                if (goodNotes.length > 0) {
                    melody.push(goodNotes.randomOne());
                }
                else {
                    melody.push(allNotes.randomOne());
                }
            }
        }
        console.log('melody generated:', melody);
        return melody;
    }
}


var melodyPatterns = [
    ['c', 'c+', 'c+', 'c+'],
    ['c', 'c-', 'c-', 'c-'],
    ['c', 'c-', 'c+', 'c+'],
    ['c', 'd+', 'c+', 'd+'],
    ['c', 'd-', 'c-', 'd+'],
    ['c', 'cj', 'd-', 'c-']
];