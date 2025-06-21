import { CardFieldType } from './validation';

/**
 * Current state of a card input field.
 */
export interface ICardFieldState {
  error: string;
  isValid: boolean;
  bin?: string;
  lastFourDigits?: string;
}

/**
 * Represents an error coming from one of the card fields.
 */
export interface ICardFieldError {
  type: CardFieldType;
}

/**
 * React state setter for card field state.
 */
export type CardFieldStateSetter = React.Dispatch<React.SetStateAction<ICardFieldState>>;
