import { useState, useEffect } from 'react';
import { storageService } from '@/lib/storage/storageService';

/**
 * Hook personnalisé pour gérer un état persisté dans localStorage
 * Compatible SSR Next.js
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState<T>(initialValue);

  // Hydration côté client
  useEffect(() => {
    setIsMounted(true);
    const storedValue = storageService.get<T>(key);
    if (storedValue !== null) {
      setState(storedValue);
    }
  }, [key]);

  // Sauvegarder à chaque changement
  const setValue = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      if (isMounted) {
        storageService.set(key, newValue);
      }
      return newValue;
    });
  };

  return [state, setValue];
}
