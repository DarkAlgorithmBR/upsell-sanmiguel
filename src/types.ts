export interface DayContent {
  dayId: number;
  title: string;
  theme: string;
  intro: string;
  reflection: string;
  verse: string;
  verseReference: string;
  question: string; // The standard daily reflection question
  pdfPath: string;
  audioEmbed: string; // Embed HTML code or iframe from Vturb
  durationLabel: string;
  manuscriptPages: { heading: string; body: string }[];
}

export interface JournalEntry {
  dayId: number;
  text: string;
  updatedAt: string; // ISO String
}

export interface FavoriteItem {
  id: string; // e.g., 'day-1', 'reflection-1', 'manuscript-1', 'audio-1'
  dayId: number;
  type: "day" | "reflection" | "manuscript" | "audio";
  title: string;
  savedAt: string; // ISO String
}

export interface LocalJourneyData {
  completedDays: number[]; // e.g. [1, 2]
  lastVisitedDay: number;
  favorites: FavoriteItem[];
  journalEntries: JournalEntry[];
  isVaultOpened: boolean;
  soundEnabled: boolean;
  firstAccessDate: string | null;
  lastReadPages?: Record<number, number>;
  dayAccessTimes?: Record<number, string>; // Maps dayId to ISO String of when it was first accessed
  bypassWaitTime?: boolean; // If true, ignore the 24-hour delay (for dev testing)
}
