import { useState, useEffect } from "react";
import { LocalJourneyData, JournalEntry, FavoriteItem } from "../types";

const LOCAL_STORAGE_KEY = "el_cofre_padre_benjamin_v2";

const DEFAULT_STATE: LocalJourneyData = {
  completedDays: [],
  lastVisitedDay: 1,
  favorites: [],
  journalEntries: [],
  isVaultOpened: false,
  soundEnabled: true,
  firstAccessDate: null,
  dayAccessTimes: {},
  bypassWaitTime: false,
};

export function useLocalJourney() {
  const [state, setState] = useState<LocalJourneyData>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validating fields to prevent corruption issues
        return {
          completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
          lastVisitedDay: typeof parsed.lastVisitedDay === "number" ? parsed.lastVisitedDay : 1,
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
          journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : [],
          isVaultOpened: typeof parsed.isVaultOpened === "boolean" ? parsed.isVaultOpened : false,
          soundEnabled: typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : true,
          firstAccessDate: parsed.firstAccessDate || null,
          dayAccessTimes: parsed.dayAccessTimes && typeof parsed.dayAccessTimes === "object" ? parsed.dayAccessTimes : {},
          bypassWaitTime: typeof parsed.bypassWaitTime === "boolean" ? parsed.bypassWaitTime : false,
        };
      }
    } catch (e) {
      console.error("Corrupted localStorage data, resetting to defaults.", e);
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Set first access date if not exists
  useEffect(() => {
    if (!state.firstAccessDate) {
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        firstAccessDate: now,
        dayAccessTimes: {
          ...prev.dayAccessTimes,
          1: now // Day 1 accessed immediately on start
        }
      }));
    }
  }, [state.firstAccessDate]);

  // Actions
  const openVault = () => {
    setState((prev) => ({ ...prev, isVaultOpened: true }));
  };

  const closeVault = () => {
    setState((prev) => ({ ...prev, isVaultOpened: false }));
  };

  const setLastVisitedDay = (dayId: number) => {
    if (dayId >= 1 && dayId <= 7) {
      setState((prev) => {
        const times = prev.dayAccessTimes || {};
        const updatedTimes = { ...times };
        
        // Record first access of this day if not already recorded
        if (!updatedTimes[dayId]) {
          updatedTimes[dayId] = new Date().toISOString();
        }

        return { 
          ...prev, 
          lastVisitedDay: dayId,
          dayAccessTimes: updatedTimes
        };
      });
    }
  };

  const recordDayAccess = (dayId: number) => {
    if (dayId >= 1 && dayId <= 7) {
      setState((prev) => {
        const times = prev.dayAccessTimes || {};
        if (times[dayId]) return prev; // already recorded

        return {
          ...prev,
          dayAccessTimes: {
            ...times,
            [dayId]: new Date().toISOString()
          }
        };
      });
    }
  };

  const toggleBypassWaitTime = () => {
    setState((prev) => ({ ...prev, bypassWaitTime: !prev.bypassWaitTime }));
  };

  const simulatePass24Hours = () => {
    setState((prev) => {
      const currentTimes = prev.dayAccessTimes || {};
      const updatedTimes: Record<number, string> = {};
      
      Object.entries(currentTimes).forEach(([day, dateStr]) => {
        const d = new Date(dateStr as string);
        d.setHours(d.getHours() - 24);
        updatedTimes[Number(day)] = d.toISOString();
      });

      // Shift first access date back 24h as well
      let updatedFirstAccess = prev.firstAccessDate;
      if (updatedFirstAccess) {
        const d = new Date(updatedFirstAccess);
        d.setHours(d.getHours() - 24);
        updatedFirstAccess = d.toISOString();
      }

      return {
        ...prev,
        firstAccessDate: updatedFirstAccess,
        dayAccessTimes: updatedTimes,
      };
    });
  };

  const toggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Completed Days Actions
  const toggleDayCompletion = (dayId: number) => {
    setState((prev) => {
      const exists = prev.completedDays.includes(dayId);
      const updatedDays = exists
        ? prev.completedDays.filter((id) => id !== dayId)
        : [...prev.completedDays, dayId];
      return { ...prev, completedDays: updatedDays };
    });
  };

  const setDayCompleted = (dayId: number, completed: boolean) => {
    setState((prev) => {
      const exists = prev.completedDays.includes(dayId);
      if (completed && !exists) {
        return { ...prev, completedDays: [...prev.completedDays, dayId] };
      } else if (!completed && exists) {
        return { ...prev, completedDays: prev.completedDays.filter((id) => id !== dayId) };
      }
      return prev;
    });
  };

  // Favorites Actions
  const toggleFavorite = (item: Omit<FavoriteItem, "savedAt">) => {
    setState((prev) => {
      const exists = prev.favorites.some((fav) => fav.id === item.id);
      const updatedFavorites = exists
        ? prev.favorites.filter((fav) => fav.id !== item.id)
        : [...prev.favorites, { ...item, savedAt: new Date().toISOString() }];
      return { ...prev, favorites: updatedFavorites };
    });
  };

  const isFavorite = (itemId: string) => {
    return state.favorites.some((fav) => fav.id === itemId);
  };

  // Journal Entries Actions
  const saveJournalEntry = (dayId: number, text: string) => {
    setState((prev) => {
      const filtered = prev.journalEntries.filter((entry) => entry.dayId !== dayId);
      const updatedEntries = [
        ...filtered,
        { dayId, text, updatedAt: new Date().toISOString() },
      ];
      return { ...prev, journalEntries: updatedEntries };
    });
  };

  const deleteJournalEntry = (dayId: number) => {
    setState((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.filter((entry) => entry.dayId !== dayId),
    }));
  };

  const clearAllData = () => {
    const now = new Date().toISOString();
    setState({
      ...DEFAULT_STATE,
      firstAccessDate: now,
      dayAccessTimes: { 1: now },
    });
  };

  return {
    state,
    openVault,
    closeVault,
    setLastVisitedDay,
    recordDayAccess,
    toggleBypassWaitTime,
    simulatePass24Hours,
    toggleSound,
    toggleDayCompletion,
    setDayCompleted,
    toggleFavorite,
    isFavorite,
    saveJournalEntry,
    deleteJournalEntry,
    clearAllData,
  };
}
