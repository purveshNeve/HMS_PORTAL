/**
 * Synthesises a clean, sweet notification chime locally using the Web Audio API.
 * Requires no external audio files, ensuring instant load time and offline safety.
 */
export function playNotificationSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();

    // Sound chime parameters: D5 (587.33Hz) followed by A5 (880.00Hz)
    // Tone 1: D5
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    gain1.gain.setValueAtTime(0.04, audioCtx.currentTime); // keep volume subtle
    gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);

    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.15);

    // Tone 2: A5 (Chime up)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.07);
    gain2.gain.setValueAtTime(0.04, audioCtx.currentTime + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);

    osc2.start(audioCtx.currentTime + 0.07);
    osc2.stop(audioCtx.currentTime + 0.25);
  } catch (error) {
    console.warn("Failed to play local synthesized notification chime:", error);
  }
}
