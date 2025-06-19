export interface IConfiguration {
  sessionkey: string;
  channel: string;
  merchantid: string;
  purchasenumber: number;
  amount: number;
  language: string;
  font: string;
}

export interface ICreateElementOptions {
  style: IElementStyles;
  placeholder: string;
}

export interface IElementStyles {
  base: {
    color: string;
    fontWeight: number;
    fontFamily: string;
    fontSize: string;
    fontSmoothing: string;
    placeholder: {
      color: string;
    };
    autofill: {
      color: string;
    };
  };
  invalid?: {
    color: string;
    '::-placeholder'?: {
      color: string;
    };
  };
}

export interface ICreateTokenResponse {
  bin: string;
  transactionToken: string;
  channel: string;
}

export interface ICardElement {
  unmount: () => void;
  on: (type: string, callback: (data: ICardElementEvent[] | string) => void) => void;
}

export type codes = 'invalid_number' | 'invalid_expiry' | 'invalid_cvc';

export interface ICardElementEvent {
  code: codes;
  message: string;
  type: string;
}

export interface IUseNiubizResponse {
  isReady: boolean;
  hasError: boolean;
  createToken: (data: IUserCardData) => Promise<ICreateTokenResponse>;
}

export interface IUserCardData {
  name: string;
  lastName: string;
  email: string;
  amount: number;
}
