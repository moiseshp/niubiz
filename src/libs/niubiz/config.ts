export const NIUBIZ_FORM_ID = 'niubiz-form';

export const NIUBIZ_FIELDS_CONFIG = {
  sessionkey: 'c2ebd575368adbce4fafa8aea9cf17a9ecc7395b24b888e2a90ff1767c91cde2',
  channel: 'web',
  merchantid: '110777209',
  amount: 20.00,
  purchasenumber: '123456',
  language: 'es',
  countable: true,
  endpoint: 'https://apitestenv.vnforapps.com',
  font: 'https://fonts.googleapis.com/css?family=Open+Sans',
  threeDS: false,
  merchantlogo: 'https://example.com/logo.png',
  form: {
    id: NIUBIZ_FORM_ID,
    style: {
      backgroundColor: '#fff',
      fontFamily: 'Open Sans',
      labelColor: '#333',
      inputColor: '#000',
      buttonColor: '#fff',
      buttonBackgroundColor: '#4caf50',
      errorColor: '#f44336'
    },
    controls: [
      {
        name: 'cardnumber',
        placeholder: 'Número de tarjeta'
      },
      {
        name: 'expirationdate',
        placeholder: 'MM/AA'
      },
      {
        name: 'cvv2',
        placeholder: 'CVV'
      }
    ]
  }
};
