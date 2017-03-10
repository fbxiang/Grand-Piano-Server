/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global PitchClassMapping */

function InputHandler(gameModel) {

    var baseOctave = 48;
    var heldNotes = [];

    function receiveInput(midiNumber, vol) {
        midiHandler.receiveMidiNumber(midiNumber, vol);
    }

    this.receiveInput = receiveInput;

    this.onkeydown = function (e) {
        var keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
        if (keyPressed in PitchClassMapping.keyboardCharToPitchClass) {
            var map = PitchClassMapping.keyboardCharToPitchClass[keyPressed];

            var pianoKey = parseInt(map["pitch"]);

            gameModel.keyPressed(pianoKey);
        }
        if (keyPressed == "p") {
            // console.log(gameActive);
            gameActive = !gameActive;
        }
        if (keyPressed == "m") {
            instantFeedback = !instantFeedback;
        }
    };
    window.onkeydown = this.onkeydown;


    this.midikeydown = function(pitch) {
        if (pitch >= 0 && pitch <= 12) {
            gameModel.keyPressed(pitch);
        }
    };

    this.onkeyup = function (e) {
        var keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
        if (keyPressed in PitchClassMapping.keyboardCharToPitchClass) {
            var map = PitchClassMapping.keyboardCharToPitchClass[keyPressed];
            gameModel.keyUp(parseInt(map["pitch"]));
        }
    };
    window.onkeyup = this.onkeyup;

    this.midikeyup = function(pitch) {
        if (pitch >= 0 && pitch <= 12) {
            gameModel.keyUp(pitch);
        }
    }

}

const midiHandler = new MidiHandler(Pizzicato);
