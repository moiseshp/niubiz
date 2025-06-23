import { ICardElementRef } from '../types';

/**
 * Resets the data in all provided Niubiz card element references.
 * Useful for clearing sensitive card data from the UI after a transaction or upon user request.
 *
 * @see {@link https://desarrolladores.niubiz.com.pe/docs/desacoplado#reset Niubiz SDK - Reset}
 *
 * @param {(ICardElementRef | null)[]} refs - Array of card element references to reset. Null values are ignored.
 * @throws {Error} If the Niubiz SDK is not available in the global `window` object.
 */
export function resetNiubizFields(refs: (ICardElementRef | null)[]) {
  if (!window.payform) {
    throw new Error('Niubiz SDK is not available.');
  }

  const elements = refs.map(ref => Promise.resolve(ref));
  window.payform.resetData(elements);
}
