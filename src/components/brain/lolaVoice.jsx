export const LOLA_VOICE = {
  rate: 0.92,
  pitch: 1.05,
  lang: "en-US",
  voiceName: "Samantha" // macOS / iOS default
};

export const LOLA_COLORS = {
  calm: ["#d9ecff", "#ffffff"],
  focused: ["#f2f2f2", "#cfcfcf"],
  alert: ["#ffe8b3", "#ffcc66"],
  success: ["#b6fff0", "#5effd2"]
};

export function speakLola(text, onEnd) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  Object.assign(u, LOLA_VOICE);
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export function playSpatial(audioUrl, x = 0, y = -0.2, z = -0.8) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const panner = audioCtx.createPanner();
    panner.panningModel = 'HRTF';
    panner.setPosition(x, y, z);

    fetch(audioUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => audioCtx.decodeAudioData(buffer))
      .then(audioBuffer => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(panner);
        panner.connect(audioCtx.destination);
        source.start(0);
      })
      .catch(err => console.error('Spatial audio error:', err));
  } catch (err) {
    console.error('AudioContext error:', err);
  }
}