import { useEffect, useRef, useState } from 'react';
import { loadSdk } from '@/libs/niubiz/load-sdk';
import { elementStyles, INiubizConfig } from '@/libs/niubiz/utils';

interface IReturn {
  isReady: boolean;
  hasError: boolean;
  tokenizeCard: () => Promise<any>;
}

interface INiubizElement {
  unmount: () => void;
}

export function useNiubiz(configuration: INiubizConfig): IReturn {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isSdkInitialized = useRef(false);
  const cardNumberRef = useRef<INiubizElement | null>(null);
  const cardExpiryRef = useRef<INiubizElement | null>(null);
  const cardCvcRef = useRef<INiubizElement | null>(null);

  const initialize = async () => {
    if (!window.payform) {
      console.log('Niubiz script not loaded or elements already created');
      return;
    }

    try {
      window.payform.setConfiguration(configuration);

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

      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Niubiz:', error);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (isSdkInitialized.current) return;

    const cleanup = loadSdk(initialize);
    isSdkInitialized.current = true;

    return () => {
      [cardNumberRef, cardExpiryRef, cardCvcRef].forEach(ref => {
        if (!ref.current) return;
        ref.current.unmount?.();
        ref.current = null;
      });

      setIsReady(false);
      cleanup();
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
