import { useEffect, useRef, useState } from 'react';
import { loadSdk } from './utils/loadSdk';
import { initializeNiubizElements } from './utils/initializeNiubizElements';
import { niubizService } from './NiubizService';
import { ICardFieldState, IUseNiubizOptions, IUseNiubizResult } from './types';

const defaultCardState: ICardFieldState = {
  error: '',
  isValid: false,
  bin: undefined,
  lastFourDigits: undefined,
  installments: undefined
};

export function useNiubiz({ configuration }: IUseNiubizOptions): IUseNiubizResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [cardNumber, setCardNumber] = useState<ICardFieldState>(defaultCardState);
  const [cardExpiry, setCardExpiry] = useState<ICardFieldState>(defaultCardState);
  const [cardCvc, setCardCvc] = useState<ICardFieldState>(defaultCardState);

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

        niubizService.setRefs({
          cardNumber: num,
          cardExpiry: exp,
          cardCvc: cvc
        });
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
      cleanupSdk();
    };
  }, [configuration]);

  return {
    isLoading,
    error,
    fields: {
      cardNumber,
      cardExpiry,
      cardCvc
    },
    isValid: allFieldsValid
  };
}
