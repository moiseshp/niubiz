// src/hooks/useNiubizSession.ts
import { useState } from 'react';

export const useNiubizSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSession = async (amount: number): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace this with your actual API call to get a session token
      const response = await fetch('/api/niubiz/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const data = await response.json();
      return data.sessionToken;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSession, isLoading, error };
};