import { useEffect, useRef, useState } from 'react';
import { loadSdk } from './utils/loadSdk';
import { initializeNiubizElements } from './utils/initializeNiubizElements';
import { createNiubizToken } from './utils/createNiubizToken';
import { resetNiubizFields } from './utils/resetNiubizFields';
import {
  ICardFieldState,
  IUseNiubizOptions,
  IUseNiubizResult,
  ICardholderData,
  ICreateTokenResult,
  ICardElementRef
} from './types';

const defaultCardState: ICardFieldState = {
  error: '',
  isValid: false,
  bin: undefined,
  lastFourDigits: undefined,
  installments: undefined
};

export function useNiubiz({ configuration }: IUseNiubizOptions): IUseNiubizResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [cardNumber, setCardNumber] = useState<ICardFieldState>(defaultCardState);
  const [cardExpiry, setCardExpiry] = useState<ICardFieldState>(defaultCardState);
  const [cardCvc, setCardCvc] = useState<ICardFieldState>(defaultCardState);

  const cardNumberRef = useRef<ICardElementRef | null>(null);
  const cardExpiryRef = useRef<ICardElementRef | null>(null);
  const cardCvcRef = useRef<ICardElementRef | null>(null);
  const isSdkInitialized = useRef(false);

  const allFieldsValid = cardNumber.isValid && cardExpiry.isValid && cardCvc.isValid;

  useEffect(() => {
    if (isSdkInitialized.current) return;

    const initialize = async () => {
      try {
        const {
          cardNumberRef: num,
          cardExpiryRef: exp,
          cardCvcRef: cvc
        } = await initializeNiubizElements(configuration, setCardNumber, setCardExpiry, setCardCvc);

        cardNumberRef.current = num;
        cardExpiryRef.current = exp;
        cardCvcRef.current = cvc;
      } catch (err) {
        console.error(err);
        setError('Failed to initialize Niubiz elements');
      } finally {
        setIsLoading(false);
      }
    };

    const cleanupSdk = loadSdk(initialize);
    isSdkInitialized.current = true;

    return () => {
      [cardNumberRef, cardExpiryRef, cardCvcRef].forEach(ref => {
        ref.current?.unmount?.();
        ref.current = null;
      });

      setIsLoading(true);
      cleanupSdk();
    };
  }, [configuration]);

  const getTransactionToken = async (data: ICardholderData): Promise<ICreateTokenResult> => {
    return createNiubizToken([cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current], data);
  };

  const resetFields = () => {
    resetNiubizFields([cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current]);
  };

  return {
    isLoading,
    error,
    getTransactionToken,
    resetFields,
    fields: {
      cardNumber,
      cardExpiry,
      cardCvc
    },
    isValid: allFieldsValid
  };
}
