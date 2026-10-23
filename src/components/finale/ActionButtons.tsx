import React, { useState } from "react";
import { MapPin, Calendar, Share2, Check, Copy } from "lucide-react";
import { WEDDING_CONFIG } from "../../config/wedding.config";

export const ActionButtons: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);

  // Generate .ics calendar file for 12:00 PM IST Reception
  const downloadIcsFile = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ameen & Suada Wedding Reception//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:ameen-suada-reception-20261108@wedding",
      "DTSTAMP:20261023T000000Z",
      // 8 Nov 2026 12:00 PM IST = 2026-11-08 06:30:00 UTC
      "DTSTART:20261108T063000Z",
      "DTEND:20261108T100000Z",
      "SUMMARY:Wedding Reception: Ameen & Suada",
      `DESCRIPTION:Wedding Reception of Ameen (${WEDDING_CONFIG.groom.familyLine}) and Suada (${WEDDING_CONFIG.bride.familyLine}).\\n\\nVenue: Shubham Auditorium, Elamkulam`,
      `LOCATION:Shubham Auditorium, Elamkulam, Kerala`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ameen-suada-reception.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowCalendarModal(false);
  };

  // Google Calendar Web Link (12:00 PM IST)
  const googleCalendarUrl = () => {
    const title = encodeURIComponent("Wedding Reception: Ameen & Suada");
    const details = encodeURIComponent(
      `With the blessings of Allah, we joyfully invite you to celebrate the wedding reception of Ameen & Suada.\n\n${WEDDING_CONFIG.groom.familyLine}\n${WEDDING_CONFIG.bride.familyLine}\n\nVenue: Shubham Auditorium, Elamkulam\nYour presence and duas will make this occasion even more special.`
    );
    const location = encodeURIComponent("Shubham Auditorium, Elamkulam, Kerala");
    const dates = "20261108T063000Z/20261108T100000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Share Invitation Link
  const handleShare = async () => {
    const shareData = {
      title: "Ameen & Suada — Wedding Reception Invitation",
      text: "You are cordially invited to celebrate the Wedding Reception of Ameen & Suada on Sunday, 8 November 2026 at 12:00 PM IST at Shubham Auditorium, Elamkulam.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* 3 Main Action Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
        {/* 1. Open in Google Maps */}
        <a
          href={WEDDING_CONFIG.event.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FAF0F2] to-[#FFF8F1] border border-[#C9A66B]/50 hover:border-[#A65368] shadow-xs hover:shadow-md transition-all text-[#4B342E]"
        >
          <MapPin className="w-4 h-4 text-[#C9A66B] group-hover:text-[#A65368] transition-colors shrink-0" />
          <span className="font-['Cinzel'] text-xs font-semibold tracking-wider">
            Open in Maps
          </span>
        </a>

        {/* 2. Add to Calendar */}
        <button
          onClick={() => setShowCalendarModal(true)}
          type="button"
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FAF0F2] to-[#FFF8F1] border border-[#C9A66B]/50 hover:border-[#A65368] shadow-xs hover:shadow-md transition-all text-[#4B342E] cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#C9A66B] group-hover:text-[#A65368] transition-colors shrink-0" />
          <span className="font-['Cinzel'] text-xs font-semibold tracking-wider">
            Add to Calendar
          </span>
        </button>

        {/* 3. Share Invitation */}
        <button
          onClick={handleShare}
          type="button"
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#A65368] hover:bg-[#8E4356] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#E5CF9F]" />
              <span className="font-['Cinzel'] text-xs font-semibold tracking-wider">
                Link Copied!
              </span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#E5CF9F] group-hover:rotate-12 transition-transform shrink-0" />
              <span className="font-['Cinzel'] text-xs font-semibold tracking-wider">
                Share Invitation
              </span>
            </>
          )}
        </button>
      </div>

      {/* Copy Link fallback helper */}
      <button
        onClick={copyToClipboard}
        type="button"
        className="inline-flex items-center gap-1.5 text-[11px] font-['Montserrat'] text-[#6B524B] hover:text-[#A65368] transition-colors pt-1 cursor-pointer"
      >
        <Copy className="w-3 h-3 text-[#C9A66B]" />
        <span>{copied ? "Invitation link copied to clipboard!" : "Or tap here to copy invitation link"}</span>
      </button>

      {/* Add to Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#FFF8F1] border-2 border-[#C9A66B] p-6 text-center shadow-2xl relative animate-scale-up">
            <h3 className="font-['Cinzel'] text-lg font-bold text-[#A65368] mb-1">
              Save the Date
            </h3>
            <p className="font-['Montserrat'] text-xs text-[#6B524B] mb-5">
              Choose your preferred calendar service for Ameen & Suada's Wedding Reception:
            </p>

            <div className="space-y-3">
              <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCalendarModal(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#C9A66B]/50 hover:bg-[#FAF0F2] text-[#4B342E] font-['Cinzel'] text-xs font-semibold tracking-wide transition-all shadow-xs"
              >
                <span>📅 Google Calendar (Web & Android)</span>
              </a>

              <button
                onClick={downloadIcsFile}
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#A65368] text-white font-['Cinzel'] text-xs font-semibold tracking-wide hover:bg-[#8E4356] transition-all shadow-md cursor-pointer"
              >
                <span>🍏 Apple Calendar / Outlook (.ics)</span>
              </button>
            </div>

            <button
              onClick={() => setShowCalendarModal(false)}
              type="button"
              className="mt-5 text-xs text-[#6B524B] hover:text-[#4B342E] underline font-['Montserrat']"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
