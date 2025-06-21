import {
  CardElementErrorType,
  CardStateSetter,
  CardValidationCodes,
  ElementKey,
  ICardElementChange,
  ICardElementError
} from './types';

export function handleBinEvent(setCardState: CardStateSetter) {
  return (data: unknown) => {
    setCardState(prev => ({ ...prev, bin: data as string }));
  };
}

export function handleLastFourDigitsEvent(setCardState: CardStateSetter) {
  return (data: unknown) => {
    setCardState(prev => ({
      ...prev,
      lastFourDigits: data as string,
      isValid: true,
      error: ''
    }));
  };
}

export function handleInstallmentsEvent(setCardState: CardStateSetter) {
  return (data: unknown) => {
    const installments = data as number[];
    setCardState(prev => ({
      ...prev,
      installments: installments?.length ? [0, ...installments] : []
    }));
  };
}

export function handleRemoveErrorEvent(setCardState: CardStateSetter, elementType: CardElementErrorType) {
  return (data: unknown) => {
    console.info({ removeError: data });
    const { type } = data as ICardElementError;
    if (type !== elementType) return;
    setCardState(prev => ({
      ...prev,
      error: 'Empty input',
      isEmpty: true
    }));
  };
}

export function handleChangeEvent(setCardState: CardStateSetter, expectedCode: CardValidationCodes) {
  return (data: unknown) => {
    console.info({ data });
    const allErrors = data as ICardElementChange[];
    if (allErrors.length === 0) {
      setCardState(prev => ({ ...prev, error: '', isValid: true }));
      return;
    }

    const currentError = allErrors.find(change => change.code === expectedCode);
    setCardState(prev => ({
      ...prev,
      error: currentError?.message || '',
      isValid: !currentError
    }));
  };
}
