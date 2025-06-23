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
