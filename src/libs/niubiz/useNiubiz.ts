import { useEffect, useRef, useState } from 'react';
import { loadSdk } from '@/libs/niubiz/load-sdk';
import { elementStyles, IConfiguration } from '@/libs/niubiz/utils';
import { IConfirmCardPaymentResponse } from './types';

interface IReturn {
  isReady: boolean;
  hasError: boolean;
  confirmCardPayment: () => Promise<IConfirmCardPaymentResponse>;
}

interface ICardElement {
  unmount: () => void;
}

export function useNiubiz(configuration: IConfiguration): IReturn {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isSdkInitialized = useRef(false);
  const cardNumberRef = useRef<ICardElement | null>(null);
  const cardExpiryRef = useRef<ICardElement | null>(null);
  const cardCvcRef = useRef<ICardElement | null>(null);

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

  const confirmCardPayment = async (): Promise<IConfirmCardPaymentResponse> => {
    if (!window.payform) {
      throw new Error('Niubiz SDK no está disponible.');
    }

    const userData = {
      name: 'Juan',
      lastName: 'Perez',
      email: 'jperez@test.com'
    };

    const response = await window.payform.createToken(
      [cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current],
      userData
    );

    console.log(response);

    return {
      bin: response.bin,
      transactionToken: response.transactionToken,
      channel: response.channel
    };

    // return {
    //   bin: 'hello',
    //   transactionToken: 'hello',
    //   channel: 'web'
    // };
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

  return { isReady, hasError, confirmCardPayment };
}
