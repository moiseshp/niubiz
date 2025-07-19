import { Channel, INiubizConfiguration } from './types';

export const elementStyles = {
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
    '::-placeholder': {
      color: '#FFCCA5'
    }
  }
};

export const elementInputs = {
  cardNumber: {
    placeholder: 'Número de tarjeta',
    id: 'card-number-id'
  },
  cardExpiry: {
    placeholder: 'MM/AA',
    id: 'card-expiry-id'
  },
  cardCvc: {
    placeholder: 'CVV',
    id: 'card-cvc-id'
  }
};

export const emptyFieldMessage = 'Este campo es requerido';

export const defaultConfiguration: INiubizConfiguration = {
  sessionkey: 'c77641831f0df839c42973050d2fb26bcc154b1f8d7d77537f04e1303c1c8a6e',
  merchantid: '110777209',
  purchasenumber: 12345,
  amount: 20,
  channel: Channel.WEB,
  language: 'es',
  font: 'https://fonts.googleapis.com/css2?family=Mukta:wght@500&display=swap'
};
