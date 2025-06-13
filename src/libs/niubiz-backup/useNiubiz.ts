import { useEffect, useRef, useState } from 'react';
import { loadSdk } from '@/libs/niubiz/loadSdk';
import { NIUBIZ_FIELDS_CONFIG } from '@/libs/niubiz/config';
import { useNiubizScript } from '@/app/dummy/useNiubizScript';
import { loadScript } from './loadScript';

export type NiubizHook = {
  isReady: boolean;
  hasError: boolean;
  tokenizeCard: () => Promise<any>;
};

interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

const elementStyles = {
  base: {
    color: 'blue',
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    placeholder: {
      color: '#999999'
    },
    autofill: {
      color: '#e39f48'
    }
  },
  invalid: {
    color: '#E25950',
    '::placeholder': {
      color: '#FFCCA5'
    }
  }
};

export function useNiubiz(): NiubizHook {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isInitialized = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});
  const elementsCreated = useRef(false);

  const cardNumberRef = useRef<any>(null);
  const cardExpiryRef = useRef<any>(null);
  const cardCvcRef = useRef<any>(null);

  const [bin, setBin] = useState<string | null>(null);
  const [lastFourDigits, setLastFourDigits] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Cargar script y guardar cleanup
    cleanupRef.current = loadScript(initializeNiubiz);

    return () => {
      // 1. Limpiar elementos de Niubiz (primero desmontar)
      [cardNumberRef, cardExpiryRef, cardCvcRef].forEach(ref => {
        ref.current?.unmount?.();
        ref.current = null;
      });

      // 2. Resetear estados
      elementsCreated.current = false;
      setIsReady(false);

      // 3. Limpiar script (opcional, solo si es necesario removerlo del DOM)
      cleanupRef.current?.();
    };
  }, []);

  const initializeNiubiz = async () => {
    if (!window.payform || elementsCreated.current) {
      console.log('Niubiz script not loaded or elements already created');
      return;
    }

    try {
      if (window.payform.resetSession) {
        window.payform.resetSession();
      }
      const configuration = {
        sessionkey: '296d275027574f8f1e849455df3a0c2ce06dd34cb50391c0dbf5f4cb213b5f96',
        channel: 'web',
        merchantid: '110777209',
        purchasenumber: '12345',
        amount: 20,
        language: 'es',
        font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap'
      };

      // window.configuration = configuration;
      window.payform.setConfiguration(configuration);

      // Only create elements if they don't exist
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
