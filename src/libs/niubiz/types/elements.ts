import { ICardElementChange } from './validation';

/**
 * Options used to create a card element.
 */
export interface ICreateCardElementOptions {
  style: ICardElementStyles;
  placeholder: string;
}

/**
 * Reference to a mounted Niubiz card element.
 */
export interface ICardElementRef {
  unmount: () => void;
  on: (type: string, callback: (data: ICardElementChange[] | number[] | string) => void) => void;
}

/**
 * CSS-like styles for Niubiz input elements.
 */
export interface ICardElementStyles {
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

/**
 * Input configuration for individual card elements.
 */
export interface ICardInputConfig {
  placeholder: string;
  id: string;
}

/**
 * Configuration object for all input fields.
 */
export interface ICardInputMappings {
  cardNumber: ICardInputConfig;
  cardExpiry: ICardInputConfig;
  cardCvc: ICardInputConfig;
}

/**
 * Keys used to map card fields.
 */
export enum CardElementKey {
  CARD_NUMBER = 'card-number',
  CARD_EXPIRY = 'card-expiry',
  CARD_CVC = 'card-cvc'
}
