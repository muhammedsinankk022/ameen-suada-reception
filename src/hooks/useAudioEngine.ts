import { useEffect, useRef, useState, useCallback } from "react";
import { WEDDING_CONFIG } from "../config/wedding.config";

export function useAudioEngine() {
  const defaultVol = WEDDING_CONFIG.audio.defaultVolume ?? 0.65;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(defaultVol);

  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(defaultVol);
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

  // Initialize single HTMLAudioElement directly connected to device speakers
  const getOrCreateAudio = useCallback(() => {
    if (!htmlAudioRef.current) {
      const audio = new Audio();
      const trackUrl = getResolvedAudioUrl();
      audio.src = trackUrl;
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = isMutedRef.current ? 0 : volumeRef.current; // 65% by default

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
  }, [getOrCreateAudio]);

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

    if (htmlAudioRef.current) {
      htmlAudioRef.current.muted = nextMuted;
      htmlAudioRef.current.volume = nextMuted ? 0 : volumeRef.current;
    }
  }, []);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    volumeRef.current = clamped;

    if (htmlAudioRef.current && !isMutedRef.current) {
      htmlAudioRef.current.volume = clamped;
    }
  }, []);

  // Immediate autoplay attempt on mount + Armed capture listeners for first interaction
  useEffect(() => {
    let unmounted = false;

    const attemptAutoplay = async () => {
      // 1. Try immediate autoplay
      const audio = getOrCreateAudio();
      try {
        audio.volume = volumeRef.current;
        await audio.play();
        if (!unmounted) {
          setIsPlaying(true);
          isPlayingRef.current = true;
          return;
        }
      } catch {
        // Autoplay blocked by browser policy without gesture
      }

      // 2. Register capture listeners on window and document for instant gesture unlock
      const handleUserGesture = async () => {
        cleanupInteractionListeners();
        if (isPlayingRef.current || unmounted) return;
        try {
          const a = getOrCreateAudio();
          a.volume = isMutedRef.current ? 0 : volumeRef.current;
          await a.play();
          if (!unmounted) {
            setIsPlaying(true);
            isPlayingRef.current = true;
          }
        } catch {}
      };

      const events = [
        "pointerdown",
        "touchstart",
        "touchend",
        "mousedown",
        "click",
        "scroll",
        "wheel",
        "keydown",
      ];

      const cleanupInteractionListeners = () => {
        events.forEach((evt) => {
          window.removeEventListener(evt, handleUserGesture, true);
          document.removeEventListener(evt, handleUserGesture, true);
        });
      };

      events.forEach((evt) => {
        window.addEventListener(evt, handleUserGesture, { capture: true, passive: true });
        document.addEventListener(evt, handleUserGesture, { capture: true, passive: true });
      });
    };

    attemptAutoplay();

    return () => {
      unmounted = true;
    };
  }, [getOrCreateAudio]);

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
          if (htmlAudioRef.current) {
            htmlAudioRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                isPlayingRef.current = true;
              })
              .catch(() => {
                setIsPlaying(false);
              });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current.src = "";
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
