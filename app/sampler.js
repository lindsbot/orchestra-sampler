// http://teropa.info/blog/2016/07/28/javascript-systems-music.html
const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SAMPLE_LIBRARY = {
  'Grand Piano': [
    { note: 'A',  octave: 4, file: 'assets/audio/Samples/Grand Piano/piano-f-a4.wav' },
    { note: 'A',  octave: 5, file: 'assets/audio/Samples/Grand Piano/piano-f-a5.wav' },
    { note: 'A',  octave: 6, file: 'assets/audio/Samples/Grand Piano/piano-f-a6.wav' },
    { note: 'C',  octave: 4, file: 'assets/audio/Samples/Grand Piano/piano-f-c4.wav' },
    { note: 'C',  octave: 5, file: 'assets/audio/Samples/Grand Piano/piano-f-c5.wav' },
    { note: 'C',  octave: 6, file: 'assets/audio/Samples/Grand Piano/piano-f-c6.wav' },
    { note: 'D#',  octave: 4, file: 'assets/audio/Samples/Grand Piano/piano-f-d#4.wav' },
    { note: 'D#',  octave: 5, file: 'assets/audio/Samples/Grand Piano/piano-f-d#5.wav' },
    { note: 'D#',  octave: 6, file: 'assets/audio/Samples/Grand Piano/piano-f-d#6.wav' },
    { note: 'F#',  octave: 4, file: 'assets/audio/Samples/Grand Piano/piano-f-f#4.wav' },
    { note: 'F#',  octave: 5, file: 'assets/audio/Samples/Grand Piano/piano-f-f#5.wav' },
    { note: 'F#',  octave: 6, file: 'assets/audio/Samples/Grand Piano/piano-f-f#6.wav' }
  ]
};

let audioContext = new AudioContext();

// Sonatina library only supports sharps
function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

// unique integer for each note
function noteValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

// calculate distance between any two notes
function getNoteDistance(note1, octave1, note2, octave2) {
  return noteValue(note1, octave1) - noteValue(note2, octave2);
}

// use getNoteDistance() to find the nearest sample to requested note
function getNearestSample(sampleBank, note, octave) {
  let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
    let distanceToA =
      Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB =
      Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function fetchSample(path) {
  path = path.replace('#', encodeURIComponent('#'));
  return fetch(path)
    .then(response => {
      return response.arrayBuffer()
    })
    .then(arrayBuffer => {
      return audioContext.decodeAudioData(arrayBuffer)
    });
}

function getSample(instrument, noteAndOctave) {
  const regex = /^(\w[b#]?)(\d)$/;
  const inputError = "Nope, your second argument isn't valid. Needs note and octave"
  if (!regex.test(noteAndOctave)) { throw inputError; }
  let [, requestedNote, requestedOctave] = regex.exec(noteAndOctave);
  requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);

  let sampleBank = SAMPLE_LIBRARY[instrument];
  let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);

  let distance =
    getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);

  return fetchSample(sample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: distance
  }));
}

function playSample(instrument, note, delaySeconds = 0, pitchShift = 1) {

  fetchSample('assets/audio/AirportTerminal.wav').then(convolverBuffer => {

    getSample(instrument, note).then(({audioBuffer, distance}) => {

      let convolver = audioContext.createConvolver();
      convolver.buffer = convolverBuffer;
      convolver.connect(audioContext.destination);

      // adjust playback rate to achieve pitch shift to correct note
      let playbackRate = Math.pow(2, distance / 12)
      // adjust playback rate of correct note to desired speed
      playbackRate = playbackRate * pitchShift;

      let bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.playbackRate.value = playbackRate;
      bufferSource.connect(convolver);
      bufferSource.start(audioContext.currentTime + delaySeconds);
    })

  })

}

function startLoop(instrument, note, loopLengthSeconds, delaySeconds, pitchShift) {
  playSample(instrument, note, delaySeconds, pitchShift);
  setInterval(
    () => playSample(instrument, note, delaySeconds, pitchShift),
    loopLengthSeconds * 1000
  );
}

function roundToTenths(n) {
  return Math.round(n * 10) / 10;
}

function randomInRange(min, max) {
  return roundToTenths(Math.random() * (max - min) + min);
}

// use ConvolverNode to get reverb!
// wav file is our impulse response sample
// fetchSample('assets/audio/AirportTerminal.wav').then(convolverBuffer => {

//   let convolver = audioContext.createConvolver();
//   convolver.buffer = convolverBuffer;
//   convolver.connect(audioContext.destination)

//   startLoop('Grand Piano', 'F4',  convolver, randomInRange(12, 22), randomInRange(0, 1), 1/3);
//   startLoop('Grand Piano', 'Ab4', convolver, randomInRange(12, 22), randomInRange(0, 5), 1/3);
//   startLoop('Grand Piano', 'C5',  convolver, randomInRange(12, 22), randomInRange(0, 8), 1/3);
//   startLoop('Grand Piano', 'Db5', convolver, randomInRange(12, 22), randomInRange(0, 11), 1/3);
//   startLoop('Grand Piano', 'Eb5', convolver, randomInRange(12, 22), randomInRange(0, 13), 1/3);
//   startLoop('Grand Piano', 'F5',  convolver, randomInRange(12, 22), randomInRange(0, 15), 1/3);
//   startLoop('Grand Piano', 'Ab5', convolver, randomInRange(12, 22), randomInRange(0, 17), 1/3);

// })

export { audioContext, fetchSample, playSample, startLoop }
