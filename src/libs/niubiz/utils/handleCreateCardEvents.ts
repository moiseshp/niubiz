import { CardFieldType, CardFieldStateSetter, CardValidationCode, ICardElementChange, ICardFieldError } from '../types';

export function handleBinEvent(setCardState: CardFieldStateSetter) {
  return (data: unknown) => {
    setCardState(prev => ({ ...prev, bin: data as string }));
  };
}

export function handleLastFourDigitsEvent(setCardState: CardFieldStateSetter) {
  return (data: unknown) => {
    setCardState(prev => ({
      ...prev,
      lastFourDigits: data as string,
      isValid: true,
      error: ''
    }));
  };
}

export function handleInstallmentsEvent(setCardState: CardFieldStateSetter) {
  return (data: unknown) => {
    const installments = data as number[];
    setCardState(prev => ({
      ...prev,
      installments: installments?.length ? [0, ...installments] : []
    }));
  };
}

export function handleRemoveErrorEvent(setCardState: CardFieldStateSetter, elementType: CardFieldType) {
  return (data: unknown) => {
    const { type } = data as ICardFieldError;
    if (type !== elementType) return;
    setCardState(prev => ({
      ...prev,
      error: 'Este campo es requerido',
      isValid: false
    }));
  };
}

export function handleChangeEvent(setCardState: CardFieldStateSetter, expectedCode: CardValidationCode) {
  return (data: unknown) => {
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
