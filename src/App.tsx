import { useState } from "react";
import confetti from "canvas-confetti";
import { FloatingPetals } from "./components/common/FloatingPetals";
import { FloatingAudioButton } from "./components/common/AudioPlayer";
import { ProgressBar } from "./components/navigation/ProgressBar";
import { TopNav } from "./components/navigation/TopNav";
import { Scene1Opening } from "./components/scenes/Scene1Opening";
import { Scene2GuestArrival } from "./components/scenes/Scene2GuestArrival";
import { Scene4FamilyBlessings } from "./components/scenes/Scene4FamilyBlessings";
import { Scene7Auditorium } from "./components/scenes/Scene7Auditorium";
import { Scene5BrideAndGroom } from "./components/scenes/Scene5BrideAndGroom";
import { Scene6RingCeremony } from "./components/scenes/Scene6RingCeremony";
import { Scene8FamilyPhotos } from "./components/scenes/Scene8FamilyPhotos";
import { Scene10InvitationCard } from "./components/scenes/Scene10InvitationCard";
import { Scene9GuestMemories } from "./components/scenes/Scene9GuestMemories";
import { Footer } from "./components/finale/Footer";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useScrollJourney } from "./hooks/useScrollJourney";

export function App() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const {
    isPlaying,
    isMuted,
    volume,
    toggleMusic,
    toggleMute,
    setVolume,
    startMusic,
  } = useAudioEngine();

  const { jumpToScene } = useScrollJourney(reducedMotion);

  // When guest clicks "Enter Reception Story" in Scene 1
  const handleEnterStory = () => {
    // Immediately initiate music playback on explicit user action
    if (!isPlaying) {
      startMusic();
    }

    // Trigger subtle golden/rose petal burst
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#F5DDE0", "#C9A66B", "#FFF8F1", "#A65368"],
    });

    // Smoothly travel to Scene 2 (Guest Arrival)
    jumpToScene("scene-2");
  };

  return (
    <div className="relative min-h-screen bg-[#FFF8F1] text-[#4B342E] selection:bg-[#F5DDE0] selection:text-[#4B342E] overflow-x-hidden font-['Montserrat']">
      {/* Scroll Progress Bar */}
      <ProgressBar />

      {/* Floating Canvas Rose Petals & Golden Sparkles */}
      {!reducedMotion && <FloatingPetals petalCount={30} sparkleCount={35} />}

      {/* Top Navigation Bar with Chapters & Controls */}
      <TopNav
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        onJumpToScene={jumpToScene}
      />

      {/* Persistent Floating Audio Toggle Button */}
      <FloatingAudioButton
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        onToggle={toggleMusic}
        onMuteToggle={toggleMute}
        onVolumeChange={setVolume}
      />

      {/* Reception Cinematic Scroll Journey Scenes */}
      <main className="relative w-full">
        {/* Scene 1 — The Opening: S ♥ A */}
        <Scene1Opening onEnterStory={handleEnterStory} />

        {/* Scene 2 — Arrival of Beloved Guests (12:00 PM) */}
        <Scene2GuestArrival />

        {/* Scene 3 — Family Blessings & Duas */}
        <Scene4FamilyBlessings />

        {/* Scene 4 — Entering Shubham Auditorium, Elamkulam */}
        <Scene7Auditorium />

        {/* Scene 5 — The Bride & Groom */}
        <Scene5BrideAndGroom />

        {/* Scene 6 — The Ring Ceremony */}
        <Scene6RingCeremony />

        {/* Scene 7 — Family Photographs & Memory Album */}
        <Scene8FamilyPhotos onTransitionToGuestGallery={() => jumpToScene("scene-9")} />

        {/* Scene 8 — Final Reception Save the Date Card */}
        <Scene10InvitationCard
          isPlaying={isPlaying}
          onToggleMusic={toggleMusic}
          onOpenGuestMemories={() => jumpToScene("scene-9")}
        />

        {/* Scene 9 — Guest Memories Photo Gallery */}
        <Scene9GuestMemories />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
