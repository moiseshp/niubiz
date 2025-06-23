import { ICardElementRef, ICardElementStyles, CardElementKey } from '../types';

/**
 * Creates a Niubiz card element, attaches the specified event handlers, and returns its reference.
 * Designed for use with the Niubiz "Desacoplado" (decoupled) SDK integration.
 *
 * @see {@link https://desarrolladores.niubiz.com.pe/docs/desacoplado Niubiz SDK - Desacoplado}
 *
 * @param {Object} params - Configuration object for initializing the card element.
 * @param {string} params.placeholder - Placeholder text shown in the input field.
 * @param {CardElementKey} params.elementKey - Type of element to create (e.g., 'CARD_NUMBER', 'CARD_EXPIRY', 'CARD_CVC').
 * @param {string} params.elementId - ID of the DOM element where the Niubiz card element will be mounted.
 * @param {Record<string, (data: unknown) => void>} params.events - Map of event names to handler functions.
 *        Available event names include:
 *        - `'bin'`: Triggered when the BIN (first 6 digits of card) is detected.
 *        - `'change'`: Triggered when the field value changes.
 *        - `'change-card-number'`: Triggered when the card number changes.
 *        - `'remove-error'`: Triggered when an error is removed.
 *        - `'installments'`: Triggered when installment options are available.
 *        - `'last-four-digits'`: Triggered when the last four digits are determined.
 * @param {ICardElementStyles} params.elementStyles - Object defining custom styles for the card element.
 *
 * @returns {Promise<ICardElementRef>} A promise that resolves to a reference of the created Niubiz card element.
 *
 * @throws {Error} If the Niubiz SDK is not available in the global `window` object.
 */

export async function createCardElement({
  placeholder,
  elementKey,
  elementId,
  events,
  elementStyles
}: {
  placeholder: string;
  elementKey: CardElementKey;
  elementId: string;
  events: Record<string, (data: unknown) => void>;
  elementStyles: ICardElementStyles;
}): Promise<ICardElementRef> {
  if (!window.payform) return Promise.reject(new Error('Niubiz SDK is not available'));

  const element = await window.payform.createElement(elementKey, { style: elementStyles, placeholder }, elementId);

  for (const [eventName, handler] of Object.entries(events)) {
    element.on(eventName, handler);
  }

  return element;
}
