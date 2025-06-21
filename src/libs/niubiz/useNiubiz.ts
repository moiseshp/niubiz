import { useEffect, useRef, useState } from 'react';
import { loadSdk } from './utils/load-sdk';
import {
  CardElementErrorType,
  CardValidationCodes,
  ElementKey,
  ICardElement,
  ICardElementRef,
  ICreateTokenResponse,
  IUseNiubiz,
  IUseNiubizResponse,
  IUserCardData
} from './utils/types';
import { createCardElement } from './utils/createCardElement';
import {
  handleBinEvent,
  handleLastFourDigitsEvent,
  handleInstallmentsEvent,
  handleChangeEvent,
  handleRemoveErrorEvent
} from './utils/handleCreateCardEvents';

const defaultCardState = {
  error: '',
  isEmpty: true,
  bin: undefined,
  lastFourDigits: undefined
};

export function useNiubiz({ configuration, elementStyles, elementInputs }: IUseNiubiz): IUseNiubizResponse {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');

  const [cardNumber, setCardNumber] = useState<ICardElement>(defaultCardState);
  const [cardExpiry, setCardExpiry] = useState<ICardElement>(defaultCardState);
  const [cardCvc, setCardCvc] = useState<ICardElement>(defaultCardState);

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
        elementKey: ElementKey.CARD_NUMBER,
        elementId: elementInputs.cardNumber.id,
        elementStyles,
        events: {
          bin: handleBinEvent(setCardNumber),
          lastFourDigits: handleLastFourDigitsEvent(setCardNumber),
          installments: handleInstallmentsEvent(setCardNumber),
          change: handleChangeEvent(setCardNumber, CardValidationCodes.INVALID_NUMBER),
          'remove-error': handleRemoveErrorEvent(setCardNumber, CardElementErrorType.CARD_NUMBER),
          'change-card-number': (value: any) => {
            console.info('change-card-number', value);
          }
        }
      });

      cardExpiryRef.current = await createCardElement({
        placeholder: elementInputs.cardExpiry.placeholder,
        elementKey: ElementKey.CARD_EXPIRY,
        elementId: elementInputs.cardExpiry.id,
        elementStyles,
        events: {
          change: handleChangeEvent(setCardExpiry, CardValidationCodes.INVALID_EXPIRY),
          'remove-error': handleRemoveErrorEvent(setCardExpiry, CardElementErrorType.CARD_EXPIRY)
        }
      });

      cardCvcRef.current = await createCardElement({
        placeholder: elementInputs.cardCvc.placeholder,
        elementKey: ElementKey.CARD_CVC,
        elementId: elementInputs.cardCvc.id,
        elementStyles,
        events: {
          change: handleChangeEvent(setCardCvc, CardValidationCodes.INVALID_CVC),
          'remove-error': handleRemoveErrorEvent(setCardCvc, CardElementErrorType.CARD_CVC)
        }
      });

      setIsReady(true);
    } catch (error) {
      console.error('Niubiz error:', error);
      setError('Error initializing Niubiz');
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
