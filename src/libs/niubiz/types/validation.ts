/**
 * Validation codes returned when a card input is invalid.
 */
export enum CardValidationCode {
  INVALID_NUMBER = 'invalid_number',
  INVALID_EXPIRY = 'invalid_expiry',
  INVALID_CVC = 'invalid_cvc'
}

/**
 * Types of card element inputs that can trigger validation errors.
 */
export enum CardFieldType {
  CARD_NUMBER = 'card-number',
  CARD_EXPIRY = 'expiry',
  CARD_CVC = 'cvc'
}

/**
 * Structure of the change event returned by a Niubiz card element.
 */
export interface ICardElementChange {
  code: CardValidationCode;
  message: string;
  type: string;
}
