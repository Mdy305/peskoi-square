const WAKE_WORDS = ["hey lola", "lola"];

export function detectWakeWord(transcript) {
  const t = transcript.toLowerCase();
  return WAKE_WORDS.some(w => t.includes(w));
}

export function stripWakeWord(transcript) {
  return transcript
    .toLowerCase()
    .replace(/hey lola|lola/gi, "")
    .trim();
}