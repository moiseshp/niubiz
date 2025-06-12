import { useEffect, useState } from 'react';

export const useNiubizScript = (onLoad: () => void) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js';
    script.async = true;

    script.onload = () => {
      if (window.payform) {
        setScriptLoaded(true);
        onLoad();
      }
    };

    script.onerror = () => {
      setError(new Error('Failed to load Niubiz script'));
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onLoad]);

  return { scriptLoaded, error };
};