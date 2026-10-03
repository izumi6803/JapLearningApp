let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    cachedVoice = null;
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase() === "ja-jp") ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("ja")) ??
    null;
  return cachedVoice;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = undefined;
    pickJapaneseVoice();
  };
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakJa(text: string, rate = 0.9): boolean {
  if (!speechSupported() || !text) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  const voice = pickJapaneseVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = 1;
  synth.speak(utterance);
  return true;
}
