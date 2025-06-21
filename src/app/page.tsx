'use client';
import { useState } from 'react';
import { useNiubiz } from '@/libs/niubiz/useNiubiz';
import { IConfiguration } from '@/libs/niubiz/utils/types';

/**
 * Para obtener el sessionKey llamar a la solicitud:
 * /v1/user/order/create-order
 */

const configuration: IConfiguration = {
  sessionkey: '11fcccf97c153f03f51dc50343845436207f49e4ada04ceeb196b9c924181edf',
  channel: 'web',
  merchantid: '110777209',
  purchasenumber: 12345,
  amount: 20,
  language: 'es',
  font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap'
};

const elementStyles = {
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

const elementInputs = {
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

export default function Home() {
  const { isReady, error, cardNumber, cardExpiry, cardCvc, createToken } = useNiubiz({
    configuration,
    elementStyles,
    elementInputs
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info('isReady', isReady);
    if (!isReady) return;
    if (!cardNumber.isValid || !cardExpiry.isValid || !cardCvc.isValid) return;
    alert('Go Niubiz!');
    setIsLoading(true);
    try {
      // const data = await createToken({
      //   name: 'Moises',
      //   lastName: 'Huaringa',
      //   email: 'moises@huaringa.com'
      // });
      /**
       * TODO: Revisar el endpoint de /v1/user/order/complete-order
       */
      console.info('Response Create Token:');
    } catch (error) {
      console.error('Error al tokenizar la tarjeta:', error);
      // Manejar el error (mostrar mensaje al usuario, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='niubiz-payment-form'>
      <h2>Pago con Tarjeta</h2>

      {error && <div>{error}</div>}
      {!isReady && <div>Cargando...</div>}

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Número de Tarjeta</label>
          <div id={elementInputs.cardNumber.id} className='input-niubiz' />
        </div>

        <code>{JSON.stringify(cardNumber, null, 2)}</code>

        {/* {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>} */}

        <div className='form-group'>
          <label>Fecha de Vencimiento (MM/AA)</label>
          <div id={elementInputs.cardExpiry.id} className='input-niubiz' />
          {/* {errors.expiry && <div className="error-message">{errors.expiry}</div>} */}
        </div>

        <code>{JSON.stringify(cardExpiry, null, 2)}</code>

        <div className='form-group'>
          <label>Código de Seguridad (CVV)</label>
          <div id={elementInputs.cardCvc.id} className='input-niubiz' />
        </div>

        <code>{JSON.stringify(cardCvc, null, 2)}</code>

        <button type='submit'>Pagar</button>

        {/* <button 
          type="submit" 
          disabled={isLoading || Object.values(errors).some(error => error)}
          className="submit-button"
        >
          {isLoading ? 'Procesando...' : `Pagar S/ ${amount.toFixed(2)}`}
        </button> */}

        {/* <button
          type='button'
          onClick={resetForm}
          className='reset-button'
        >
          Limpiar Formulario
        </button> */}
      </form>

      {error && <div>Ocurrió un error al cargar el formulario de pago. Por favor, recarga la página.</div>}
    </div>
  );
}
