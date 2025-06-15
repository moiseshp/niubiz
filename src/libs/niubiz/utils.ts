export interface INiubizConfig {
  sessionkey: string;
  channel: string;
  merchantid: string;
  purchasenumber: string;
  amount: number;
  language: string;
  font: string;
}

export interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

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
    '::placeholder': {
      color: '#FFCCA5'
    }
  }
};
