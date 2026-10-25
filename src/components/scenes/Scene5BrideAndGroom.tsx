import React from "react";
import { BackgroundMonogram } from "../common/BackgroundMonogram";
import { BrassLantern } from "../common/BrassLantern";
import { ActionButtons } from "../finale/ActionButtons";
import { WEDDING_CONFIG } from "../../config/wedding.config";

export const Scene5BrideAndGroom: React.FC = () => {
  return (
    <section
      id="scene-characters"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-[#FFF8F1] via-[#FAF0F2] to-[#FFF8F1] overflow-hidden text-center"
    >
      {/* Hanging Brass Lanterns */}
      <div className="absolute top-0 left-6 sm:left-14 z-10 hidden sm:block">
        <BrassLantern size="md" chainLength={40} />
      </div>
      <div className="absolute top-0 right-6 sm:right-14 z-10 hidden sm:block">
        <BrassLantern size="md" chainLength={40} />
      </div>

      {/* Subtle Background Monogram */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <BackgroundMonogram size="hero" subtle />
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Monogram Emblem */}
        <div className="mb-2">
          <BackgroundMonogram size="sm" subtle />
        </div>

        {/* Couple Names Header */}
        <div className="my-2">
          <h2 className="font-['Cinzel'] text-2xl sm:text-4xl font-bold text-[#A65368] tracking-widest flex items-center justify-center gap-2">
            <span>Ameen</span>
            <span className="text-[#C9A66B] text-[0.8em] animate-pulse">♥</span>
            <span>Suada</span>
          </h2>
        </div>

        {/* Section Title */}
        <h3 className="font-['Cinzel'] text-lg sm:text-2xl font-bold text-[#4B342E] tracking-wider mb-2">
          The Groom & Bride
        </h3>

        {/* Romantic Caption */}
        <p className="font-['Cormorant_Garamond'] italic text-base sm:text-xl text-[#A65368] max-w-lg mb-6 leading-relaxed font-medium">
          "A new chapter. A lifetime of togetherness."
        </p>

        {/* Illustrated Wedding Characters Card (Original Artwork) */}
        <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-[#C9A66B]/50 shadow-[0_20px_60px_rgba(201,166,107,0.25)] group bg-[#FAF0F2]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src="./assets/images/scene_couple.jpg"
              alt="Ameen & Suada - Faceless Kerala Muslim Couple in Ivory Sherwani and Blush Bridal Attire"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 text-left text-white drop-shadow-md">
              <span className="font-['Cinzel'] text-[10px] sm:text-xs tracking-widest uppercase text-[#E5CF9F] font-semibold block">
                Ameen & Suada
              </span>
              <p className="font-['Montserrat'] text-xs sm:text-sm text-white/95">
                The groom in refined ivory and gold beside the bride in an embroidered blush-rose bridal gown with a graceful flowing veil.
              </p>
            </div>
          </div>
        </div>

        {/* Family Lineage Box */}
        <div className="mt-8 space-y-1.5 text-center py-3.5 px-6 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#EAD6BD]/70 w-full max-w-md shadow-xs">
          <p className="font-['Cinzel'] text-xs sm:text-sm font-semibold text-[#4B342E] tracking-wide">
            {WEDDING_CONFIG.groom.familyLine}
          </p>
          <div className="w-12 h-[1px] bg-[#C9A66B]/40 mx-auto" />
          <p className="font-['Cinzel'] text-xs sm:text-sm font-semibold text-[#4B342E] tracking-wide">
            {WEDDING_CONFIG.bride.familyLine}
          </p>
        </div>

        {/* Closing Blessings Message */}
        <div className="mt-5 px-4 py-2.5 rounded-xl bg-[#FAF0F2]/70 border border-[#EAD6BD]/50 max-w-md">
          <p className="font-['Cormorant_Garamond'] italic text-base sm:text-lg text-[#A65368] font-semibold leading-relaxed">
            "Your presence and duas will make this occasion even more special."
          </p>
        </div>

        {/* Action Buttons: Add to Calendar, Venue Map, Share Invitation */}
        <div className="mt-6 w-full max-w-md">
          <ActionButtons />
        </div>
      </div>
    </section>
  );
};
