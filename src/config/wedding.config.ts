// ============================================================================
// AMEEN & SUADA — RECEPTION INVITATION OFFICIAL CONFIGURATION
// Website 1: Dedicated Reception Invitation Only (12:00 PM IST, Shubham Auditorium)
// ============================================================================

export interface WeddingConfig {
  couple: {
    title: string;
    monogram: string;
    firstInitial: string;
    secondInitial: string;
  };
  groom: {
    name: string;
    father: string;
    mother: string;
    familyLine: string;
  };
  bride: {
    name: string;
    father: string;
    mother: string;
    familyLine: string;
  };
  event: {
    title: string;
    eventType: string;
    dateFormatted: string;
    dayFormatted: string;
    dayNumber: string;
    monthYear: string;
    timeFormatted: string;
    timezone: string;
    venueName: string;
    venueCity: string;
    venueAddress: string;
    googleMapsUrl: string;
    // 8 Nov 2026 12:00 PM IST = 2026-11-08T12:00:00+05:30
    targetDateIso: string;
  };
  creator: {
    name: string;
    credit: string;
    phone: string;
    whatsappUrl: string;
  };
  features: {
    enableRingCeremony: boolean;
    enableAudioAutoplayPrompt: boolean;
    adminModerationPin: string;
    maxUploadPhotosCount: number;
    maxUploadFileSizeMb: number;
  };
  supabase: {
    url: string;
    anonKey: string;
    storageBucket: string;
    tableName: string;
  };
  audio: {
    title: string;
    subtitle: string;
    defaultTrackUrl: string;
    lowpassCutoffHz: number;
    defaultVolume: number;
  };
}

export const WEDDING_CONFIG: WeddingConfig = {
  couple: {
    title: "Ameen & Suada",
    monogram: "A ♥ S",
    firstInitial: "A",
    secondInitial: "S",
  },
  groom: {
    name: "Ameen",
    father: "Umer Korakkalikkuth",
    mother: "Fathimath Suhara",
    familyLine: "S/o Mr. Umer Korakkalikkuth & Mrs. Fathimath Suhara",
  },
  bride: {
    name: "Suada",
    father: "Mustafa Maraparambil",
    mother: "Thasleena",
    familyLine: "D/o Mustafa Maraparambil & Mrs. Thasleena",
  },
  event: {
    title: "Wedding Reception",
    eventType: "RECEPTION",
    dateFormatted: "08 NOVEMBER 2026",
    dayFormatted: "SUNDAY",
    dayNumber: "08",
    monthYear: "NOVEMBER 2026",
    timeFormatted: "12:00 PM IST",
    timezone: "Asia/Kolkata",
    venueName: "Shubham Auditorium",
    venueCity: "Elamkulam",
    venueAddress: "Shubham Auditorium, Elamkulam, Kerala, India",
    googleMapsUrl: "https://maps.app.goo.gl/yPGhBjin3nAw1gLw9",
    targetDateIso: "2026-11-08T12:00:00+05:30",
  },
  creator: {
    name: "Muhammad Sinan KK",
    credit: "Website crafted with love by Muhammad Sinan KK",
    phone: "9645956291",
    whatsappUrl: "https://wa.me/919645956291",
  },
  features: {
    enableRingCeremony: true,
    enableAudioAutoplayPrompt: false, // OFF by default as per instruction
    adminModerationPin: "2026",
    maxUploadPhotosCount: 10,
    maxUploadFileSizeMb: 15,
  },
  supabase: {
    url: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_URL || "",
    anonKey: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || "",
    storageBucket: "reception-guest-photos",
    tableName: "reception_photos",
  },
  audio: {
    title: "Wedding Nasheed (Muffled)",
    subtitle: "Gentle acoustic nasheed with softened warmth",
    defaultTrackUrl: "./assets/audio/nasheed.mp3",
    lowpassCutoffHz: 1100,
    defaultVolume: 0.65,
  },
};
