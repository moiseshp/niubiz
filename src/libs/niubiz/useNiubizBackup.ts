import { useEffect, useRef, useState } from 'react';
import { loadSdk } from './utils/loadSdk';
import { createCardElement } from './utils/createCardElement';
import {
  handleBinEvent,
  handleLastFourDigitsEvent,
  handleInstallmentsEvent,
  handleChangeEvent,
  handleRemoveErrorEvent
} from './utils/handleCreateCardEvents';
import { elementInputs, elementStyles } from './constants';
import {
  CardElementKey,
  CardFieldType,
  CardValidationCode,
  ICardElementRef,
  ICardFieldState,
  ICardholderData,
  ICreateTokenResult,
  IUseNiubizOptions,
  IUseNiubizResult
} from './types';

const defaultCardState = {
  error: '',
  isValid: false,
  bin: undefined,
  lastFourDigits: undefined
};

export function useNiubiz({ configuration }: IUseNiubizOptions): IUseNiubizResult {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');

  const [cardNumber, setCardNumber] = useState<ICardFieldState>(defaultCardState);
  const [cardExpiry, setCardExpiry] = useState<ICardFieldState>(defaultCardState);
  const [cardCvc, setCardCvc] = useState<ICardFieldState>(defaultCardState);

  const cardNumberRef = useRef<ICardElementRef | null>(null);
  const cardExpiryRef = useRef<ICardElementRef | null>(null);
  const cardCvcRef = useRef<ICardElementRef | null>(null);
  const isSdkInitialized = useRef(false);

  const initialize = async () => {
    if (!window.payform) {
      setError('Niubiz script not loaded or elements already created');
      return;
    }

    try {
      window.payform.setConfiguration(configuration);

      cardNumberRef.current = await createCardElement({
        placeholder: elementInputs.cardNumber.placeholder,
        elementKey: CardElementKey.CARD_NUMBER,
        elementId: elementInputs.cardNumber.id,
        elementStyles,
        events: {
          bin: handleBinEvent(setCardNumber),
          lastFourDigits: handleLastFourDigitsEvent(setCardNumber),
          installments: handleInstallmentsEvent(setCardNumber),
          'change-card-number': handleChangeEvent(setCardNumber, CardValidationCode.INVALID_NUMBER),
          'remove-error': handleRemoveErrorEvent(setCardNumber, CardFieldType.CARD_NUMBER)
        }
      });

      cardExpiryRef.current = await createCardElement({
        placeholder: elementInputs.cardExpiry.placeholder,
        elementKey: CardElementKey.CARD_EXPIRY,
        elementId: elementInputs.cardExpiry.id,
        elementStyles,
        events: {
          change: handleChangeEvent(setCardExpiry, CardValidationCode.INVALID_EXPIRY),
          'remove-error': handleRemoveErrorEvent(setCardExpiry, CardFieldType.CARD_EXPIRY)
        }
      });

      cardCvcRef.current = await createCardElement({
        placeholder: elementInputs.cardCvc.placeholder,
        elementKey: CardElementKey.CARD_CVC,
        elementId: elementInputs.cardCvc.id,
        elementStyles,
        events: {
          change: handleChangeEvent(setCardCvc, CardValidationCode.INVALID_CVC),
          'remove-error': handleRemoveErrorEvent(setCardCvc, CardFieldType.CARD_CVC)
        }
      });

      setIsReady(true);
    } catch (error) {
      console.error('Niubiz error:', error);
      setError('Error initializing Niubiz');
    }
  };

  const createToken = async (userCardData: ICardholderData): Promise<ICreateTokenResult> => {
    if (!window.payform) {
      throw new Error('Niubiz SDK no está disponible.');
    }

    const response = await window.payform.createToken(
      [cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current],
      userCardData
    );

    window.payform.resetData([cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current]);

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
        ref.current?.unmount?.();
        ref.current = null;
      });

      setIsReady(false);
      cleanup();
    };
  }, []);

  return {
    isReady,
    error,
    cardNumber,
    cardExpiry,
    cardCvc,
    createToken
  };
}
