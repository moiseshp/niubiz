import { useEffect, useState } from 'react';
const formInputStyles = {
  base: {
    width: '100%',
    color: 'green',
    border: '1px solid 3px',
    fontWeight: 500,
    fontFamily: "'HelveticaNeue', sans-serif",
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    placeholder: { color: 'red' },
    autofill: { color: '#747576' }
  },
  invalid: {
    color: '#ff7a7a',
    '::placeholder': { color: '#ff7a7a' }
  }
};
 
const inputConfigMap = {
  cardNumber: {
    style: formInputStyles,
    placeholder: 'Número de tarjeta'
  },
  cardExpiry: {
    style: formInputStyles,
    placeholder: 'MM/AA'
  },
  cardCvv: {
    style: formInputStyles,
    placeholder: 'CVV'
  }
};

const elementStyles = {
  base: {
   color: '#666666',
   fontWeight: 700,
   fontFamily: "'Montserrat', sans-serif",
   fontSize: '16px',
   fontSmoothing: 'antialiased',
   placeholder: {
    color: '#999999',
   },
   autofill: {
    color: '#e39f48',
   },
  },
 invalid: {
  color: '#E25950',
  '::placeholder': {
   color: '#FFCCA5',
   },
  },
 };

 
interface Props {
  onFormLoadComplete?: () => void;
  setTestIdProgress?: (dataTestId: string) => void;
}
 
const formLoadingErrorMessage = 'Error al cargar el formulario de pago';
 
export const useCardFormLoader = ({ onFormLoadComplete, setTestIdProgress }: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();
  const [hasExpiredTime, setHasExpiredTime] = useState(false);
  const [installmentOptions, setInstallmentOptions] = useState<number[]>([]);
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [cardCvvError, setCardCvvError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const initCardFormConfig = (response: any) => {
    const configuration = {
      sessionkey: response?.sessionKeyNiubiz,
      channel: 'web',
      merchantid: response?.merchantId,
      purchasenumber: response?.purchaseNumber,
      amount: response?.totalAmmount,
      language: 'es',
      font: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap'
    };
 
    try {

      // window.configuration = configuration;
      window.payform?.setConfiguration?.(configuration);
      createForm();
      // createExpirationTime(response?.expirationTimeInMinutes || 1);
    } catch(error) {
      console.error({error})
      // setErrorMessage(formLoadingErrorMessage);
    } finally {
    }
  };
 
  const createExpirationTime = (expiryMinutes: number) => {
    if (timerId) clearTimeout(timerId);
 
    const timeout = (expiryMinutes - 1) * 60 * 1000;
 
    const id = setTimeout(() => {
      setHasExpiredTime(true);
    }, timeout);
 
    setTimerId(id);
  };
 
  const validateCardField = (data: any[], errorCode: string, setError: (message: string) => void) => {
    setError('');
 
    if (data.length > 0) {
      data.forEach((element: any) => {
        if (element['code'] === errorCode) setError(element['message']);
      });
    }
  };
 
  const createForm = async () => {
    setTestIdProgress?.('createForm');
 
    try {

      var card = window.payform.createElement('card',
{
 style: elementStyles,
 placeholder: 'Número de tarjeta'
}
 , 'txtTarjeta');
 card.then(element => {
  element.on('bin', function (data) {
   /* Tú código aquí */
  });
  element.on('change', function (data) {
   /* Tú código aquí */
  });
  element.on('dcc', function (data) {
   /* Tú código aquí */
  });
  element.on('installments', function (data) {
   /* Tú código aquí */
  });
 });

 /* Caso de uso: Controles independientes */
 var cardNumber = await window.payform.createElement('card-number',
 {
  style: elementStyles,
  placeholder: 'Número de tarjeta'
 }
 , 'txtNumeroTarjeta');
 cardNumber.then(element => {
  element.on('bin', function (data) {
   /* Tú código aquí */
  });
  element.on('change', function (data) {
   /* Tú código aquí */
  });
  element.on('dcc', function (data) {
   /* Tú código aquí */
  });
  element.on('installments', function (data) {
   /* Tú código aquí */
  });
  element.on('lastFourDigits', function (data) {
   /* Tú código aquí */
  });
 });
 var cardExpiry = await window.payform.createElement('card-expiry',
  {
   style: elementStyles,
   placeholder: 'MM/YY'
  }
  , 'txtFechaVencimiento');
 cardExpiry.then(element => {
  element.on('change', function (data) {
   /* Tú código aquí */
  });
 });
 var cardCvc = await window.payform.createElement('card-cvc',
 {
  style: elementStyles,
  placeholder: 'CVC'
 }
 , 'txtCvv');
 cardCvc.then(element => {
  element.on('change', function (data) {
   /* Tú código aquí */
  });
 });
      
      // window.cardNumber = await window.payform.createElement(
      //   'card-number',
      //   inputConfigMap['cardNumber'],
      //   'number-card'
      // );
 
      // window.cardNumber.on('installments', (data: any) => {
      //   data?.length > 0 ? setInstallmentOptions([0, ...data]) : setInstallmentOptions([]);
      // });
 
      // window.cardNumber.on('change', (data: any[]) => {
      //   validateCardField(data, 'invalid_number', setCardNumberError);
      //   validateCardField(data, 'invalid_expiry', setCardExpiryError);
      //   validateCardField(data, 'invalid_cvc', setCardCvvError);
      // });
 
      // window.cardExpiry = await window.payform.createElement(
      //   'card-expiry',
      //   inputConfigMap['cardExpiry'],
      //   'expiry-date'
      // );
 
      // window.cardExpiry.on('change', (data: any[]) => {
      //   validateCardField(data, 'invalid_expiry', setCardExpiryError);
      // });
 
      // window.cardCvv = await window.payform.createElement('card-cvc', inputConfigMap['cardCvv'], 'security-code');
 
      // window.cardCvv.on('change', (data: any[]) => {
      //   validateCardField(data, 'invalid_cvc', setCardCvvError);
      // });
 
      setTimeout(() => {
        setShowForm(true);
        onFormLoadComplete?.();
      }, 1000);
    } catch(error) {
      console.error({error})
      // setErrorMessage(formLoadingErrorMessage);
    }
  };
 
  const handleError = (message: string) => {
    console.error(message); 
  };
 
  // useEffect(() => {
  //   if (hasExpiredTime) {
  //     setErrorMessage('El tiempo de espera para completar el pago finalizo. \n\n Por favor vuelve a intentarlo');
  //   }
  // }, [hasExpiredTime, errorMessage]);
 
  useEffect(() => {
    if (errorMessage) handleError(errorMessage);
  }, [errorMessage]);
 
  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);
 
  return {
    initCardFormConfig,
    installmentOptions,
    showForm,
    cardNumberError,
    cardExpiryError,
    cardCvvError
  };
};
 