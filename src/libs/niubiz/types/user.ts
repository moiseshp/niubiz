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
  alias: string;
  amount: number;
  userBlockId: string;
}

/**
 * Response structure returned after successfully creating a token.
 */
export interface ICreateTokenResult {
  bin: string;
  channel: string;
  transactionToken: string;
}

export interface ICreateTokenResultError {
  data: any;
  errorCode: number;
  errorMessage: string;
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
  isLoading: boolean;
  error: string;
  getTransactionToken: (data: ICardholderData) => Promise<ICreateTokenResult>;
  resetFields: () => void;
  fields: {
    cardNumber: ICardFieldState;
    cardExpiry: ICardFieldState;
    cardCvc: ICardFieldState;
  };
  isValid: boolean;
}
