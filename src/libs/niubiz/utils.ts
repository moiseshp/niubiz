import { ICreateElementOptions } from './types';

const ELEMENT_STYLES = {
  base: {
    color: 'blue',
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    placeholder: {
      color: '#999999'
    },
    autofill: {
      color: '#e39f48'
    }
  },
  invalid: {
    color: '#E25950',
    '::placeholder': {
      color: '#FFCCA5'
    }
  }
};

export const ELEMENT_ID = {
  cardNumber: 'card-number-id',
  cardExpiry: 'card-expiry-id',
  cardCvc: 'card-cvc-id'
};

export const ELEMENT_TAG = {
  cardNumber: 'card-number',
  cardExpiry: 'card-expiry',
  cardCvc: 'card-cvc'
};

export function getElementOptions(placeholder: string): ICreateElementOptions {
  return {
    style: ELEMENT_STYLES,
    placeholder
  };
}
