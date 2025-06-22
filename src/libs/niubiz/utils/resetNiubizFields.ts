import { ICardElementRef } from '../types';

export function resetNiubizFields(refs: (ICardElementRef | null)[]) {
  if (!window.payform) {
    throw new Error('Niubiz SDK is not available.');
  }

  const elements = refs.map(ref => Promise.resolve(ref));
  window.payform.resetData(elements);
}
