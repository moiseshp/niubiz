import { INiubizConfiguration } from './config';
import { ICardElementStyles, ICardInputMappings } from './elements';
import { ICardFieldState } from './state';

/**
 * Data collected from the user for token creation.
 */
export interface ICardholderData {
  name: string;
  lastName: string;
  email: string;
  amount: number;
}

/**
 * Response structure returned after successfully creating a token.
 */
export interface ICreateTokenResult {
  bin: string;
  transactionToken: string;
  channel: string;
}

/**
 * Options passed to the custom hook that integrates Niubiz.
 */
export interface IUseNiubizOptions {
  configuration: INiubizConfiguration;
  elementStyles?: ICardElementStyles;
  elementInputs?: ICardInputMappings;
}

/**
 * Values returned by the Niubiz integration hook.
 */
export interface IUseNiubizResult {
  isReady: boolean;
  error: string;
  cardNumber: ICardFieldState;
  cardExpiry: ICardFieldState;
  cardCvc: ICardFieldState;
  createToken: (data: ICardholderData) => Promise<ICreateTokenResult>;
}
