/**
 * Niubiz Card Element Event Handlers
 *
 * These utility functions return event handler functions compatible with the Niubiz SDK
 * in desacoplado (decoupled) mode. Each handler is responsible for updating the card input
 * state based on a specific event triggered by a Niubiz card field element.
 *
 * @module NiubizCardEventHandlers
 */

import { CardFieldType, CardFieldStateSetter, CardValidationCode, ICardElementChange, ICardFieldError } from '../types';

/**
 * Handles the 'bin' event from Niubiz, which returns the first 6 digits of the card.
 *
 * @param {CardFieldStateSetter} setCardState - Function to update the card field state.
 * @returns {(data: unknown) => void} Event handler function for 'bin' event.
 */
export function handleBinEvent(setCardState: CardFieldStateSetter): (data: unknown) => void {
  return (data: unknown) => {
    setCardState(prev => ({ ...prev, bin: data as string }));
  };
}

/**
 * Handles the 'last-four-digits' event, typically triggered once the card number is validated.
 *
 * @param {CardFieldStateSetter} setCardState - Function to update the card field state.
 * @returns {(data: unknown) => void} Event handler function for 'last-four-digits' event.
 */
export function handleLastFourDigitsEvent(setCardState: CardFieldStateSetter): (data: unknown) => void {
  return (data: unknown) => {
    setCardState(prev => ({
      ...prev,
      lastFourDigits: data as string,
      isValid: true,
      error: ''
    }));
  };
}

/**
 * Handles the 'installments' event, which provides the list of available installment options.
 *
 * @param {CardFieldStateSetter} setCardState - Function to update the card field state.
 * @returns {(data: unknown) => void} Event handler function for 'installments' event.
 */
export function handleInstallmentsEvent(setCardState: CardFieldStateSetter): (data: unknown) => void {
  return (data: unknown) => {
    const installments = data as number[];
    setCardState(prev => ({
      ...prev,
      installments: installments?.length ? [0, ...installments] : []
    }));
  };
}

/**
 * Handles the 'remove-error' event, typically triggered when a user corrects an input error.
 * If the event type matches the current element, the error is reset.
 *
 * @param {CardFieldStateSetter} setCardState - Function to update the card field state.
 * @param {CardFieldType} elementType - The type of field (e.g., 'card-number', 'expiry', etc.).
 * @returns {(data: unknown) => void} Event handler function for 'remove-error' event.
 */
export function handleRemoveErrorEvent(
  setCardState: CardFieldStateSetter,
  elementType: CardFieldType
): (data: unknown) => void {
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

/**
 * Handles the 'change' event, used to detect validation errors in real-time.
 * It checks whether the expected validation code exists in the event payload.
 *
 * @param {CardFieldStateSetter} setCardState - Function to update the card field state.
 * @param {CardValidationCode} expectedCode - The specific validation error code to watch for.
 * @returns {(data: unknown) => void} Event handler function for 'change' event.
 */
export function handleChangeEvent(
  setCardState: CardFieldStateSetter,
  expectedCode: CardValidationCode
): (data: unknown) => void {
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
