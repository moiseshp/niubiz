import { useEffect, useRef, useState } from 'react';
import { loadSdk } from './load-sdk';
import { ELEMENT_ID, ELEMENT_TAG, getElementOptions } from './utils';
import {
  ICardElement,
  ICardElementEvent,
  IConfiguration,
  ICreateTokenResponse,
  IUseNiubizResponse,
  IUserCardData
} from './types';

export function useNiubiz(configuration: IConfiguration): IUseNiubizResponse {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [cardNumber, setCardNumber] = useState({
    id: ELEMENT_ID.cardNumber,
    bin: '',
    lastFourDigits: '',
    isValid: false,
    message: ''
  });
  const cardNumberRef = useRef<ICardElement | null>(null);
  const cardExpiryRef = useRef<ICardElement | null>(null);
  const cardCvcRef = useRef<ICardElement | null>(null);
  const isSdkInitialized = useRef(false);

  const initialize = async () => {
    if (!window.payform) {
      console.error('Niubiz script not loaded or elements already created');
      return;
    }

    try {
      window.payform.setConfiguration(configuration);

      cardNumberRef.current = await window.payform.createElement(
        ELEMENT_TAG.cardNumber,
        getElementOptions('**** **** **** ****'),
        ELEMENT_ID.cardNumber
      );

      cardExpiryRef.current = await window.payform.createElement(
        ELEMENT_TAG.cardExpiry,
        getElementOptions('MM/AA'),
        ELEMENT_ID.cardExpiry
      );

      cardCvcRef.current = await window.payform.createElement(
        ELEMENT_TAG.cardCvc,
        getElementOptions('***'),
        ELEMENT_ID.cardCvc
      );

      cardNumberRef.current?.on('bin', data => {
        console.info({ bin: data });
        if (!data) return;

        setCardNumber({ ...cardNumber, bin: data as string });
      });
      cardNumberRef.current?.on('change', data => {
        const [element] = data as ICardElementEvent[];
        console.info({ element });
        if (!element) {
          setCardNumber({ ...cardNumber, isValid: true, message: '' });
        } else {
          setCardNumber({
            ...cardNumber,
            isValid: element.code !== 'invalid_number',
            message: element.message
          });
        }
      });
      // cardNumberRef.current?.on('dcc', data => {
      //   console.info({ dcc: data });
      // });
      // cardNumberRef.current?.on('installments', data => {
      //   console.info({ installments: data });
      // });
      cardNumberRef.current?.on('lastFourDigits', data => {
        console.info({ lastFourDigits: data });
      });

      cardExpiryRef.current?.on('change', data => {
        console.info({ cardExpiryRef: data });
      });
      cardCvcRef.current?.on('change', data => {
        console.info({ cardCvcRef: data });
      });

      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Niubiz:', error);
      setHasError(true);
    }
  };

  const createToken = async (userCardData: IUserCardData): Promise<ICreateTokenResponse> => {
    if (!window.payform) {
      throw new Error('Niubiz SDK no está disponible.');
    }

    const response = await window.payform.createToken(
      [cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current],
      userCardData
    );

    console.info(response);

    return {
      bin: response?.bin,
      transactionToken: response?.transactionToken,
      channel: response?.channel
    };
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

  return {
    isReady,
    hasError,
    cardNumber,
    createToken
  };
}
