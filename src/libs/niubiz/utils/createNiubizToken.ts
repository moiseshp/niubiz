import { ICardElementRef, ICardholderData, ICreateTokenResult } from '../types';

export async function createNiubizToken(
  refs: (ICardElementRef | null)[],
  data: ICardholderData
): Promise<ICreateTokenResult> {
  if (!window.payform) {
    throw new Error('Niubiz SDK is not available.');
  }

  return window.payform.createToken(refs, data);
}
