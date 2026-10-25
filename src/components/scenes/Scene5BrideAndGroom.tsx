import React from "react";
import { ChevronDown } from "lucide-react";
import { BackgroundMonogram } from "../common/BackgroundMonogram";
import { BrassLantern } from "../common/BrassLantern";

interface Scene5BrideAndGroomProps {
  onScrollToNext?: () => void;
}

export const Scene5BrideAndGroom: React.FC<Scene5BrideAndGroomProps> = ({ onScrollToNext }) => {
  return (
    <section
      id="scene-characters"
      className="relative min-h-screen w-full flex flex-col items-center justify-between py-20 px-4 bg-gradient-to-b from-[#FFF8F1] via-[#FAF0F2] to-[#FFF8F1] overflow-hidden text-center"
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

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-10 my-auto">
        {/* Monogram Emblem */}
        <div className="mb-2">
          <BackgroundMonogram size="sm" subtle />
        </div>

        {/* Couple Names Header */}
        <div className="my-2">
          <h2 className="font-['Cinzel'] text-2xl sm:text-4xl lg:text-5xl font-bold text-[#A65368] tracking-widest flex items-center justify-center gap-2">
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
        <p className="font-['Cormorant_Garamond'] italic text-base sm:text-xl text-[#A65368] max-w-lg mb-8 leading-relaxed font-medium">
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

        {/* Scroll Guide to Section 3: Save the Date Invitation */}
        {onScrollToNext && (
          <button
            type="button"
            onClick={onScrollToNext}
            aria-label="Scroll to Save the Date Invitation Card"
            className="mt-8 inline-flex flex-col items-center gap-1 text-[#6B524B] opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
          >
            <span className="font-['Montserrat'] text-[10px] tracking-widest uppercase font-medium">
              Save the Date Invitation
            </span>
            <ChevronDown className="w-4 h-4 text-[#A65368] animate-bounce" />
          </button>
        )}
      </div>
    </section>
  );
};
