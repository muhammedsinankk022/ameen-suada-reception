import { useEffect, useRef, useState, useCallback } from "react";
import { WEDDING_CONFIG } from "../config/wedding.config";

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(WEDDING_CONFIG.audio.defaultVolume ?? 0.5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const isPlayingRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(WEDDING_CONFIG.audio.defaultVolume ?? 0.5);
  const isMutedRef = useRef<boolean>(false);
  const wasPlayingBeforeTabHiddenRef = useRef<boolean>(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Robust absolute track URL resolver (works across GitHub Pages, localhost, and custom domains)
  const getResolvedAudioUrl = useCallback(() => {
    try {
      const rawUrl = WEDDING_CONFIG.audio.defaultTrackUrl || "assets/audio/nasheed.mp3";
      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        return rawUrl;
      }
      const cleanPath = rawUrl.replace(/^\.\//, "");
      const base = document.baseURI || window.location.href;
      let normalized = base;
      if (!normalized.endsWith("/") && !normalized.split("/").pop()?.includes(".")) {
        normalized += "/";
      } else if (!normalized.endsWith("/")) {
        normalized = normalized.substring(0, normalized.lastIndexOf("/") + 1);
      }
      return new URL(cleanPath, normalized).href;
    } catch {
      return WEDDING_CONFIG.audio.defaultTrackUrl;
    }
  }, []);

  // Setup Web Audio filter pipeline for the "Muffled" gentle effect
  const setupWebAudioPipeline = useCallback((audio: HTMLAudioElement) => {
    try {
      if (audioContextRef.current && mediaElementSourceRef.current) {
        return;
      }
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMutedRef.current ? 0 : volumeRef.current, ctx.currentTime);

      // Lowpass Biquad Filter Node for "Muffled" / Softened warmth (1100-1200Hz)
      const biquad = ctx.createBiquadFilter();
      biquad.type = "lowpass";
      biquad.frequency.setValueAtTime(WEDDING_CONFIG.audio.lowpassCutoffHz || 1200, ctx.currentTime);
      biquad.Q.setValueAtTime(0.7, ctx.currentTime);

      const source = ctx.createMediaElementSource(audio);
      source.connect(biquad);
      biquad.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioContextRef.current = ctx;
      masterGainRef.current = masterGain;
      filterNodeRef.current = biquad;
      mediaElementSourceRef.current = source;
    } catch {
      // Direct element playback fallback if Web Audio is restricted
    }
  }, []);

  // Initialize single HTMLAudioElement
  const getOrCreateAudio = useCallback(() => {
    if (!htmlAudioRef.current) {
      const audio = new Audio();
      const trackUrl = getResolvedAudioUrl();
      audio.src = trackUrl;
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = isMutedRef.current ? 0 : volumeRef.current;

      audio.addEventListener("ended", () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      });

      htmlAudioRef.current = audio;
    }
    return htmlAudioRef.current;
  }, [getResolvedAudioUrl]);

  const startMusic = useCallback(async () => {
    const audio = getOrCreateAudio();
    if (!audio) return false;

    try {
      setupWebAudioPipeline(audio);
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume().catch(() => {});
      }

      // Update volumes
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          isMutedRef.current ? 0 : volumeRef.current,
          audioContextRef.current.currentTime
        );
      }
      audio.volume = isMutedRef.current ? 0 : volumeRef.current;

      await audio.play();
      setIsPlaying(true);
      isPlayingRef.current = true;
      return true;
    } catch {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return false;
    }
  }, [getOrCreateAudio, setupWebAudioPipeline]);

  const pauseMusic = useCallback(() => {
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlayingRef.current) {
      pauseMusic();
    } else {
      startMusic();
    }
  }, [pauseMusic, startMusic]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMutedRef.current;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;

    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        nextMuted ? 0 : volumeRef.current,
        audioContextRef.current.currentTime
      );
    }
    if (htmlAudioRef.current) {
      htmlAudioRef.current.muted = nextMuted;
    }
  }, []);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    volumeRef.current = clamped;

    if (!isMutedRef.current && masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        clamped,
        audioContextRef.current.currentTime
      );
    }
    if (htmlAudioRef.current && !isMutedRef.current) {
      htmlAudioRef.current.volume = clamped;
    }
  }, []);

  // Autoplay on mount + Interaction fallback listener
  useEffect(() => {
    let unmounted = false;

    const attemptAutoplay = async () => {
      try {
        const success = await startMusic();
        if (success && !unmounted) {
          return;
        }
      } catch {}

      // Autoplay blocked by browser policy: register fallback user interaction listeners
      const handleUserGesture = async () => {
        if (!isPlayingRef.current && !unmounted) {
          await startMusic();
        }
        removeInteractionListeners();
      };

      const removeInteractionListeners = () => {
        window.removeEventListener("pointerdown", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
        window.removeEventListener("click", handleUserGesture);
      };

      window.addEventListener("pointerdown", handleUserGesture, { once: true });
      window.addEventListener("keydown", handleUserGesture, { once: true });
      window.addEventListener("touchstart", handleUserGesture, { once: true });
      window.addEventListener("click", handleUserGesture, { once: true });
    };

    attemptAutoplay();

    return () => {
      unmounted = true;
    };
  }, [startMusic]);

  // Tab switch & visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden or user switched away
        if (isPlayingRef.current) {
          wasPlayingBeforeTabHiddenRef.current = true;
          if (htmlAudioRef.current) {
            htmlAudioRef.current.pause();
          }
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      } else {
        // User returned to tab
        if (wasPlayingBeforeTabHiddenRef.current) {
          wasPlayingBeforeTabHiddenRef.current = false;
          startMusic().catch(() => {
            setIsPlaying(false);
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startMusic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current.src = "";
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
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
