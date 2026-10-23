import React from "react";
import { BackgroundMonogram } from "../common/BackgroundMonogram";
import { BrassLantern } from "../common/BrassLantern";

export const Scene2GuestArrival: React.FC = () => {
  return (
    <section
      id="scene-2"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-[#FFF8F1] via-[#FAF0F2] to-[#FFF8F1] overflow-hidden"
    >
      {/* Lanterns on sides */}
      <div className="absolute top-0 left-6 z-10 hidden sm:block">
        <BrassLantern size="md" chainLength={40} />
      </div>
      <div className="absolute top-0 right-6 z-10 hidden sm:block">
        <BrassLantern size="md" chainLength={40} />
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Monogram */}
        <div className="mb-2">
          <BackgroundMonogram size="sm" subtle />
        </div>

        {/* Time Badge: 12:00 PM */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0F2] border border-[#C9A66B]/50 shadow-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-pulse" />
          <span className="font-['Cinzel'] text-xs font-bold text-[#A65368] tracking-widest uppercase">
            12:00 PM IST • Reception Arrival
          </span>
        </div>

        {/* Scene Title */}
        <h2 className="font-['Cinzel'] text-2xl sm:text-4xl font-bold text-[#4B342E] tracking-wider mb-2">
          Arrival of Beloved Guests
        </h2>

        {/* Caption */}
        <p className="font-['Cormorant_Garamond'] italic text-base sm:text-xl text-[#A65368] max-w-lg mb-8 leading-relaxed">
          "A joyful afternoon. A warm gathering of families. A celebration of love and unity."
        </p>

        {/* Illustrated Guests Card */}
        <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-[#C9A66B]/50 shadow-[0_20px_60px_rgba(201,166,107,0.25)] group bg-[#FAF0F2]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src="./assets/images/scene_mosque_v2.jpg"
              alt="Ameen & Suada - Guests Arriving at Wedding Celebration"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 text-left text-white drop-shadow-md">
              <span className="font-['Cinzel'] text-[10px] sm:text-xs tracking-widest uppercase text-[#E5CF9F] font-semibold block">
                Welcoming Families & Friends
              </span>
              <p className="font-['Montserrat'] text-xs sm:text-sm text-white/95">
                Loved ones gathering in traditional festive attire with warm salaams and congratulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
