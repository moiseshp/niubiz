import { createCardElement } from '../utils/createCardElement';
import { CardElementKey, CardFieldType, CardValidationCode, ICardFieldState, ICardElementRef } from '../types';
import { elementInputs, elementStyles } from '../constants';
import {
  handleBinEvent,
  handleLastFourDigitsEvent,
  handleInstallmentsEvent,
  handleChangeEvent,
  handleRemoveErrorEvent
} from '../utils/handleCreateCardEvents';

interface InitResult {
  cardNumberRef: ICardElementRef;
  cardExpiryRef: ICardElementRef;
  cardCvcRef: ICardElementRef;
}

export async function initializeNiubizElements(
  configuration: any,
  setCardNumber: React.Dispatch<React.SetStateAction<ICardFieldState>>,
  setCardExpiry: React.Dispatch<React.SetStateAction<ICardFieldState>>,
  setCardCvc: React.Dispatch<React.SetStateAction<ICardFieldState>>
): Promise<InitResult> {
  if (!window.payform) {
    throw new Error('Niubiz SDK no está disponible.');
  }

  window.payform.setConfiguration(configuration);

  const cardNumberRef = await createCardElement({
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

  const cardExpiryRef = await createCardElement({
    placeholder: elementInputs.cardExpiry.placeholder,
    elementKey: CardElementKey.CARD_EXPIRY,
    elementId: elementInputs.cardExpiry.id,
    elementStyles,
    events: {
      change: handleChangeEvent(setCardExpiry, CardValidationCode.INVALID_EXPIRY),
      'remove-error': handleRemoveErrorEvent(setCardExpiry, CardFieldType.CARD_EXPIRY)
    }
  });

  const cardCvcRef = await createCardElement({
    placeholder: elementInputs.cardCvc.placeholder,
    elementKey: CardElementKey.CARD_CVC,
    elementId: elementInputs.cardCvc.id,
    elementStyles,
    events: {
      change: handleChangeEvent(setCardCvc, CardValidationCode.INVALID_CVC),
      'remove-error': handleRemoveErrorEvent(setCardCvc, CardFieldType.CARD_CVC)
    }
  });

  return { cardNumberRef, cardExpiryRef, cardCvcRef };
}
