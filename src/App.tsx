import { useState } from "react";
import { FloatingPetals } from "./components/common/FloatingPetals";
import { FloatingAudioButton } from "./components/common/AudioPlayer";
import { ProgressBar } from "./components/navigation/ProgressBar";
import { TopNav } from "./components/navigation/TopNav";
import { Scene2GuestArrival } from "./components/scenes/Scene2GuestArrival";
import { Scene5BrideAndGroom } from "./components/scenes/Scene5BrideAndGroom";
import { Scene10InvitationCard } from "./components/scenes/Scene10InvitationCard";
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
  } = useAudioEngine();

  const { jumpToScene } = useScrollJourney(reducedMotion);

  return (
    <div className="relative min-h-screen bg-[#FFF8F1] text-[#4B342E] selection:bg-[#F5DDE0] selection:text-[#4B342E] overflow-x-hidden font-['Montserrat']">
      {/* Scroll Progress Bar */}
      <ProgressBar />

      {/* Floating Canvas Rose Petals & Golden Sparkles */}
      {!reducedMotion && <FloatingPetals petalCount={25} sparkleCount={30} />}

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

      {/* Main Wedding Invitation */}
      <main className="relative w-full">
        {/* Section 1 — Mosque (Reception Gathering) */}
        <Scene2GuestArrival onScrollToNext={() => jumpToScene("scene-characters")} />

        {/* Section 2 — Wedding Characters (Ameen & Suada) */}
        <Scene5BrideAndGroom onScrollToNext={() => jumpToScene("scene-10")} />

        {/* Section 3 — Save the Date Invitation Card */}
        <Scene10InvitationCard
          isPlaying={isPlaying}
          onToggleMusic={toggleMusic}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
