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

export interface ICardElementRef {
  unmount: () => void;
  on: (type: string, callback: (data: ICardElementChange[] | number[] | string) => void) => void;
}

export enum CardValidationCodes {
  INVALID_NUMBER = 'invalid_number',
  INVALID_EXPIRY = 'invalid_expiry',
  INVALID_CVC = 'invalid_cvc'
}

export interface ICardElementChange {
  code: CardValidationCodes;
  message: string;
  type: string;
}

export enum CardElementErrorType {
  CARD_NUMBER = 'card-number',
  CARD_EXPIRY = 'expiry',
  CARD_CVC = 'cvc'
}

export interface ICardElementError {
  type: CardElementErrorType;
}

export interface IUseNiubizResponse {
  isReady: boolean;
  error: string;
  cardNumber: ICardElement;
  cardExpiry: ICardElement;
  cardCvc: ICardElement;
  createToken: (data: IUserCardData) => Promise<ICreateTokenResponse>;
}

export enum ElementKey {
  CARD_NUMBER = 'card-number',
  CARD_EXPIRY = 'card-expiry',
  CARD_CVC = 'card-cvc'
}

export interface IUseNiubiz {
  configuration: IConfiguration;
  elementStyles: IElementStyles;
  elementInputs: IElementInputs;
}

export interface IElementInputs {
  cardNumber: {
    placeholder: string;
    id: string;
  };
  cardExpiry: {
    placeholder: string;
    id: string;
  };
  cardCvc: {
    placeholder: string;
    id: string;
  };
}

export interface ICardElement {
  error: string;
  isValid: boolean;
  bin?: string;
  lastFourDigits?: string;
}

export interface IUserCardData {
  name: string;
  lastName: string;
  email: string;
  amount: number;
}

export type CardStateSetter = React.Dispatch<React.SetStateAction<ICardElement>>;

export interface ICreateTokenResponse {
  bin: string;
  transactionToken: string;
  channel: string;
}
