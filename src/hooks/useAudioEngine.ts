import { useEffect, useRef, useState, useCallback } from "react";
import { WEDDING_CONFIG } from "../config/wedding.config";

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(WEDDING_CONFIG.audio.defaultVolume);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const audioIntervalRef = useRef<number | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(WEDDING_CONFIG.audio.defaultVolume);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Lazy initialize AudioContext with a dedicated Muffled Lowpass Filter
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();

      // Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volumeRef.current, ctx.currentTime);

      // Lowpass Biquad Filter Node for "Muffled" / Softened gentle nasheed warmth
      const biquad = ctx.createBiquadFilter();
      biquad.type = "lowpass";
      biquad.frequency.setValueAtTime(WEDDING_CONFIG.audio.lowpassCutoffHz || 1100, ctx.currentTime);
      biquad.Q.setValueAtTime(0.7, ctx.currentTime);

      biquad.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioContextRef.current = ctx;
      masterGainRef.current = masterGain;
      filterNodeRef.current = biquad;
    }
    return audioContextRef.current;
  }, [isMuted]);

  // Synthetic acoustic warm oud/string melodic sequence for muffled gentle ambience
  const playPluck = useCallback((freq: number, detune = 0, gainVal = 0.08) => {
    const ctx = audioContextRef.current;
    const filter = filterNodeRef.current;
    if (!ctx || !filter) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const pluckGain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);

    oscHarmonic.type = "sine";
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);
    oscHarmonic.detune.setValueAtTime(detune + 3, now);

    pluckGain.gain.setValueAtTime(0.0001, now);
    pluckGain.gain.linearRampToValueAtTime(gainVal, now + 0.05);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    osc.connect(pluckGain);
    oscHarmonic.connect(pluckGain);
    pluckGain.connect(filter); // Routed through Muffled filter!

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 3.5);
    oscHarmonic.stop(now + 3.5);
  }, []);

  const startMusic = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    // Check if HTML5 audio track exists
    if (WEDDING_CONFIG.audio.defaultTrackUrl && !htmlAudioRef.current) {
      const audio = new Audio(WEDDING_CONFIG.audio.defaultTrackUrl);
      audio.loop = true;
      audio.crossOrigin = "anonymous";

      try {
        if (ctx && filterNodeRef.current && !mediaElementSourceRef.current) {
          const source = ctx.createMediaElementSource(audio);
          source.connect(filterNodeRef.current);
          mediaElementSourceRef.current = source;
        }
      } catch {
        // Fallback to direct element volume if CORS restricts AudioContext source
        audio.volume = isMuted ? 0 : volumeRef.current;
      }

      htmlAudioRef.current = audio;
    }

    if (htmlAudioRef.current) {
      const playPromise = htmlAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If audio file not found or blocked, seamlessly activate synthetic muffled nasheed engine
          startSyntheticEngine();
        });
      }
    } else {
      startSyntheticEngine();
    }
  }, [getAudioContext, isMuted]);

  const startSyntheticEngine = useCallback(() => {
    let step = 0;
    const peacefulChords = [
      [146.83, 220.0, 293.66, 440.0], // D minor serene
      [196.0, 293.66, 392.0, 466.16],  // G minor
      [220.0, 261.63, 349.23, 523.25], // F / A warmth
      [174.61, 233.08, 349.23, 440.0], // Bb maj7 barakah
    ];

    const playAmbientStep = () => {
      if (!isPlayingRef.current) return;
      const chord = peacefulChords[step % peacefulChords.length];
      chord.forEach((n, i) => {
        setTimeout(() => {
          if (isPlayingRef.current) {
            playPluck(n, (Math.random() - 0.5) * 5, 0.08);
          }
        }, i * 420 + Math.random() * 80);
      });
      step++;
    };

    playAmbientStep();
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = window.setInterval(playAmbientStep, 3800);
  }, [playPluck]);

  const pauseMusic = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend().catch(() => {});
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, pauseMusic, startMusic]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        nextMuted ? 0 : volumeRef.current,
        audioContextRef.current.currentTime
      );
    }
    if (htmlAudioRef.current) {
      htmlAudioRef.current.muted = nextMuted;
    }
  }, [isMuted]);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    volumeRef.current = clamped;

    if (!isMuted && masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        clamped,
        audioContextRef.current.currentTime
      );
    }
    if (htmlAudioRef.current && !isMuted) {
      htmlAudioRef.current.volume = clamped;
    }
  }, [isMuted]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (htmlAudioRef.current) htmlAudioRef.current.pause();
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, []);

  return {
    isPlaying,
    isMuted,
    volume,
    trackTitle: WEDDING_CONFIG.audio.title,
    toggleMusic,
    toggleMute,
    setVolume,
    startMusic,
    pauseMusic,
  };
}
