;(function(namespace) {
  'use strict';

  	var samples = [];
	var examplesBox = document.getElementById('samples');
	var noteSelector = document.getElementById('note-picker');
	var harmonySelector = document.getElementById('harmony-picker');

	/**
	 * Make all logic about harmony preparation and representation
	 * @param  {string} note    Note string
	 * @param  {string} harmony Harmony string
	 */
	var run = function(note, harmony) {
		samples = [];
		samples.push({
			result: new Note(note).buildHarmony('melodic', 'minor').harmonyToString(),
			title: 'Melodic minor'
		});

		samples.push({
			result: new Note(note).buildHarmony('harmonic', 'major').harmonyToString(),
			title: 'Harmonic major'
		});

		samples.push({
			result: new Note(note).buildHarmony('harmonic', 'minor').harmonyToString(),
			title: 'Harmonic minor'
		});

		// Cleanup and draw. Causes child request to cleanUpPianoKeys function
		drawPianoKeys(note, harmony);

		examplesBox.innerHTML = '';

		samples.forEach(function(sample){
			var title = document.createElement('h3');
			var line = document.createElement('p');

			title.innerHTML = sample.title;
			line.innerHTML = sample.result;
			line.className = 'alert alert-info';
			examplesBox.appendChild(title);
			examplesBox.appendChild(line);
		});
	}

	/**
	 * Remove 'active' class from piano keys
	 * @param  {[type]} button [description]
	 * @return {[type]}        [description]
	 */
	var cleanUpPianoKeys = function(button) {
		var blackKey = {};
		if (button.className == undefined && button.className !== 'key') {
			return;
		}
		button.classList.remove('active');

		blackKey = button.parentNode.querySelector('span');
		if (blackKey == null || blackKey.className == undefined) {
			return;
		}
		blackKey.classList.remove('active');
	}

	/**
	 * Clean 'Active classes' and add actual 'Active' classes
	 * @param  {string} note    Note
	 * @param  {string} harmony Harmony
	 */
	var drawPianoKeys = function(note, harmony) {
		var line = {};
		var keys = {};

		harmony = harmony.split('_');
		if (harmony.length !== 2) {
			return false;
		}

		line = new Note(note).buildHarmony(harmony[0], harmony[1]).harmonyToArray();
		midiPlayer.playHarmony(line);

		Pianoboard.markActiveKeys(line);
	}

	/**
	 * Build notes dropdown dynamicaly
	 * @return {[type]} [description]
	 */
	var buildNoteSelector = function() {
		Note.prototype.notes.forEach(function(single){
			var option = document.createElement('option');
			option.value = single + '2';
			option.innerHTML = single + '2';
			noteSelector.appendChild(option);
		})
	}

	/**
	 * Encapsulated trigger for event handlers
	 * @return {[type]} [description]
	 */
	var refreshPiano = function() {
		var target = document.querySelector('#note-picker option:checked').value;
		var harmonyElement = document.querySelector('#harmony-picker option:checked');

		document.getElementById('selected-harmony').innerHTML = harmonyElement.innerHTML;
		run(target, harmonyElement.value);
	}

	/**
	 * Start event listeners
	 */
	var fireEventListeners = function() {
		// Change note listener
		noteSelector.addEventListener('change', function(event){
			refreshPiano();
		});

		// Change harmony listener
		harmonySelector.addEventListener('change', function(event){
			refreshPiano();
		});
	}

	// For the test purposes
	console.log('Midi',(new Note('C3')).toMIDI());

	fireEventListeners();
	buildNoteSelector();
	refreshPiano();
})(window.Note = window.Note || {});