import { ICardElementRef, ICardholderData, ICreateTokenResult } from '../types';

export async function createNiubizToken(
  refs: (ICardElementRef | null)[],
  data: ICardholderData
): Promise<ICreateTokenResult> {
  if (!window.payform) {
    throw new Error('Niubiz SDK is not available.');
  }

  const response = await window.payform.createToken(refs, data);
  window.payform.resetData(refs);

  return {
    bin: response?.bin,
    transactionToken: response?.transactionToken,
    channel: response?.channel
  };
}
