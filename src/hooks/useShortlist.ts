import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Athlete } from '@/types';

const STORAGE_KEY = '@scoutiq_shortlist';

export interface UseShortlistReturn {
  shortlist: Athlete[];
  isShortlisted: (id: string) => boolean;
  addToShortlist: (athlete: Athlete) => Promise<void>;
  removeFromShortlist: (id: string) => Promise<void>;
  toggleShortlist: (athlete: Athlete) => Promise<void>;
  isLoading: boolean;
}

export function useShortlist(): UseShortlistReturn {
  const [shortlist, setShortlist] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setShortlist(JSON.parse(stored) as Athlete[]);
        }
      } catch {
        // Storage read failed, start with empty list
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = async (list: Athlete[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage write failed
    }
  };

  const isShortlisted = useCallback(
    (id: string) => shortlist.some((a) => a.id === id),
    [shortlist],
  );

  const addToShortlist = useCallback(
    async (athlete: Athlete) => {
      if (isShortlisted(athlete.id)) return;
      const updated = [...shortlist, athlete];
      setShortlist(updated);
      await persist(updated);
    },
    [shortlist, isShortlisted],
  );

  const removeFromShortlist = useCallback(
    async (id: string) => {
      const updated = shortlist.filter((a) => a.id !== id);
      setShortlist(updated);
      await persist(updated);
    },
    [shortlist],
  );

  const toggleShortlist = useCallback(
    async (athlete: Athlete) => {
      if (isShortlisted(athlete.id)) {
        await removeFromShortlist(athlete.id);
      } else {
        await addToShortlist(athlete);
      }
    },
    [isShortlisted, addToShortlist, removeFromShortlist],
  );

  return { shortlist, isShortlisted, addToShortlist, removeFromShortlist, toggleShortlist, isLoading };
}
