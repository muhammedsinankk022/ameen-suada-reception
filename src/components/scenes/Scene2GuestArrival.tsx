import React from "react";
import { MapPin, Calendar, Clock, ChevronDown } from "lucide-react";
import { BackgroundMonogram } from "../common/BackgroundMonogram";
import { BrassLantern } from "../common/BrassLantern";
import { BismillahCalligraphy } from "../common/BismillahCalligraphy";
import { WEDDING_CONFIG } from "../../config/wedding.config";

interface Scene2GuestArrivalProps {
  onScrollToNext?: () => void;
}

export const Scene2GuestArrival: React.FC<Scene2GuestArrivalProps> = ({ onScrollToNext }) => {
  return (
    <section
      id="scene-mosque"
      className="relative min-h-screen w-full flex flex-col items-center justify-between pt-16 pb-12 px-4 bg-gradient-to-b from-[#FFF8F1] via-[#FAF0F2] to-[#FFF8F1] overflow-hidden text-center"
    >
      {/* Hanging Brass Lanterns */}
      <div className="absolute top-0 left-6 sm:left-14 z-10 hidden sm:block">
        <BrassLantern size="md" chainLength={45} />
      </div>
      <div className="absolute top-0 right-6 sm:right-14 z-10 hidden sm:block">
        <BrassLantern size="lg" chainLength={30} />
      </div>

      {/* Subtle Background Monogram */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <BackgroundMonogram size="hero" subtle />
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Top Opening: Bismillah Calligraphy */}
        <div className="pt-2 sm:pt-4 mb-4">
          <BismillahCalligraphy size="md" />
        </div>

        {/* Monogram Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-[1px] bg-[#C9A66B]/50" />
          <span className="font-['Cinzel'] text-xs font-bold tracking-[0.3em] text-[#C9A66B] uppercase">
            A ♥ S
          </span>
          <span className="w-8 h-[1px] bg-[#C9A66B]/50" />
        </div>

        {/* MAIN EVENT HEADING: RECEPTION */}
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border-2 border-[#C9A66B] bg-[#FAF0F2] shadow-sm mb-3">
          <h1 className="font-['Cinzel'] text-sm sm:text-base font-bold tracking-[0.35em] text-[#A65368] uppercase">
            RECEPTION
          </h1>
        </div>

        {/* Couple Names */}
        <h2 className="font-['Cinzel'] text-2xl sm:text-4xl lg:text-5xl font-bold text-[#4B342E] tracking-wider mb-2">
          {WEDDING_CONFIG.couple.title}
        </h2>

        {/* Event Schedule & Venue Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#EAD6BD]/70 text-[#4B342E] text-xs font-['Cinzel'] font-semibold shadow-xs mb-3">
          <span className="flex items-center gap-1.5 text-[#A65368]">
            <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
            {WEDDING_CONFIG.event.dateFormatted}
          </span>
          <span className="text-[#C9A66B] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
            {WEDDING_CONFIG.event.timeFormatted}
          </span>
          <span className="text-[#C9A66B] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-[#4B342E]">
            <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
            {WEDDING_CONFIG.event.venueName}, {WEDDING_CONFIG.event.venueCity}
          </span>
        </div>

        {/* Official Opening Caption */}
        <p className="font-['Cormorant_Garamond'] italic text-base sm:text-xl text-[#A65368] max-w-xl mb-6 leading-relaxed font-medium">
          "With the blessings of Allah, we joyfully invite you to celebrate the wedding reception of Ameen and Suada."
        </p>

        {/* Illustrated Mosque Card (Original Artwork) */}
        <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-[#C9A66B]/50 shadow-[0_20px_60px_rgba(201,166,107,0.25)] group bg-[#FAF0F2]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src="./assets/images/scene_mosque_v2.jpg"
              alt="Ameen & Suada - Mosque Entrance & Arrival"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left text-white drop-shadow-md">
              <div>
                <span className="font-['Cinzel'] text-[10px] sm:text-xs tracking-widest uppercase text-[#E5CF9F] font-semibold block">
                  Ameen & Suada
                </span>
                <p className="font-['Montserrat'] text-xs sm:text-sm text-white/95">
                  {WEDDING_CONFIG.event.venueName}, {WEDDING_CONFIG.event.venueCity} • {WEDDING_CONFIG.event.timeFormatted}
                </p>
              </div>

              <a
                href={WEDDING_CONFIG.event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A65368] hover:bg-[#8E4356] border border-[#C9A66B] text-white text-xs font-['Cinzel'] tracking-wider shadow-md transition-all transform hover:scale-105"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E5CF9F]" />
                <span>Venue Map</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Guide to Section 2 */}
        {onScrollToNext && (
          <button
            type="button"
            onClick={onScrollToNext}
            aria-label="Scroll to view Wedding Characters"
            className="mt-6 inline-flex flex-col items-center gap-1 text-[#6B524B] opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
          >
            <span className="font-['Montserrat'] text-[10px] tracking-widest uppercase font-medium">
              View Wedding Couple
            </span>
            <ChevronDown className="w-4 h-4 text-[#A65368] animate-bounce" />
          </button>
        )}
      </div>
    </section>
  );
};
