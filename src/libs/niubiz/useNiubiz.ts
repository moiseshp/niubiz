import { useEffect, useRef, useState } from 'react';
import { loadSdk } from '@/libs/niubiz/load-sdk';
import { elementStyles } from '@/libs/niubiz/config';

export type NiubizHook = {
  isReady: boolean;
  hasError: boolean;
  tokenizeCard: () => Promise<any>;
};

export function useNiubiz(configuration: any): NiubizHook {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isInitialized = useRef(false);
  const elementsCreated = useRef(false);
  const cardNumberRef = useRef<any>(null);
  const cardExpiryRef = useRef<any>(null);
  const cardCvcRef = useRef<any>(null);

  const initializeNiubiz = async () => {
    if (!window.payform || elementsCreated.current) {
      console.log('Niubiz script not loaded or elements already created');
      return;
    }

    try {
      window.payform.setConfiguration(configuration);
      if (elementsCreated.current) return;

      cardNumberRef.current = await window.payform.createElement(
        'card-number',
        {
          style: elementStyles,
          placeholder: 'Número de tarjeta'
        },
        'card-number-id'
      );

      cardExpiryRef.current = await window.payform.createElement(
        'card-expiry',
        {
          style: elementStyles,
          placeholder: 'MM/AA'
        },
        'card-expiry-id'
      );

      cardCvcRef.current = await window.payform.createElement(
        'card-cvc',
        {
          style: elementStyles,
          placeholder: 'CVV'
        },
        'card-cvc-id'
      );

      elementsCreated.current = true;
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Niubiz:', error);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const cleanup = loadSdk(initializeNiubiz);

    return () => {
      [cardNumberRef, cardExpiryRef, cardCvcRef].forEach(ref => {
        ref.current?.unmount?.();
        ref.current = null;
      });

      elementsCreated.current = false;
      setIsReady(false);
      cleanup?.();
    };
  }, []);

  const tokenizeCard = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.payform) {
        reject(new Error('Niubiz SDK no está disponible.'));
        return;
      }

      window.payform.createToken((response: any) => {
        if (response.object === 'error') {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  };

  return { isReady, hasError, tokenizeCard };
}
