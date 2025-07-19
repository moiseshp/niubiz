import { ICardElementRef, ICardholderData, ICreateTokenResult } from './types';

class NiubizService {
  private static instance: NiubizService;
  private cardNumberRef: ICardElementRef | null = null;
  private cardExpiryRef: ICardElementRef | null = null;
  private cardCvcRef: ICardElementRef | null = null;

  private constructor() {}

  public static getInstance(): NiubizService {
    if (!NiubizService.instance) {
      NiubizService.instance = new NiubizService();
    }
    return NiubizService.instance;
  }

  public setRefs(refs: {
    cardNumber: ICardElementRef | null;
    cardExpiry: ICardElementRef | null;
    cardCvc: ICardElementRef | null;
  }) {
    this.cardNumberRef = refs.cardNumber;
    this.cardExpiryRef = refs.cardExpiry;
    this.cardCvcRef = refs.cardCvc;
  }

  public async createToken(data: ICardholderData): Promise<ICreateTokenResult> {
    if (!this.cardNumberRef || !this.cardExpiryRef || !this.cardCvcRef) {
      throw new Error('Niubiz elements not initialized');
    }

    if (!window.payform) {
      throw new Error('Niubiz SDK is not available.');
    }

    return window.payform.createToken([this.cardNumberRef, this.cardExpiryRef, this.cardCvcRef], data);
  }

  public async resetFields() {
    if (!window.payform) {
      throw new Error('Niubiz SDK is not available.');
    }

    const elements = [this.cardNumberRef, this.cardExpiryRef, this.cardCvcRef].map(ref => Promise.resolve(ref));
    window.payform.resetData(elements);
  }
}

export const niubizService = NiubizService.getInstance();
