import { ICardElementRef, ICardholderData, ICreateTokenResult } from '../types';

/**
 * Requests a Niubiz token using the provided card element references and cardholder data.
 * This function is designed for use with the Niubiz "Desacoplado" (decoupled) SDK integration.
 *
 * @see {@link https://desarrolladores.niubiz.com.pe/docs/desacoplado#tokenizacion Niubiz SDK - Tokenization}
 *
 * @param {(ICardElementRef | null)[]} refs - Array of card element references created by the Niubiz SDK.
 *        Each reference must correspond to a valid card input (e.g., card-number, card-expiry, card-cvc).
 *        Null values are ignored.
 * @param {ICardholderData} data - Cardholder data object, containing fields required by Niubiz for tokenization.
 *        Must include cardholder name, document type, and number, as specified in the Niubiz docs.
 * @returns {Promise<ICreateTokenResult>} A promise that resolves to the tokenization result object, containing the token and any additional data.
 * @throws {Error} If the Niubiz SDK is not available in the global `window` object.
 */
export async function createNiubizToken(
  refs: (ICardElementRef | null)[],
  data: ICardholderData
): Promise<ICreateTokenResult> {
  if (!window.payform) {
    throw new Error('Niubiz SDK is not available.');
  }

  return window.payform.createToken(refs, data);
}
