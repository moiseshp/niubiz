'use client';
import { useState } from 'react';
import { useNiubiz } from '@/libs/niubiz/useNiubiz';
import { INiubizConfig } from '@/libs/niubiz/utils';

const configuration: INiubizConfig = {
  sessionkey: '694b02e6c443ed70b39066feeb4fad5116c5446fa075121346edfcb9b80aefbe',
  channel: 'web',
  merchantid: '110777209',
  purchasenumber: '12345',
  amount: 20,
  language: 'es',
  font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap'
};

export default function Home() {
  const { isReady, hasError, tokenizeCard } = useNiubiz(configuration);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) return;

    setIsLoading(true);
    try {
      const tokenResponse = await tokenizeCard();
      console.log('Token generado:', tokenResponse);
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

      {!isReady && <div>Cargando...</div>}

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Número de Tarjeta</label>
          <div id='card-number-id' className='input-niubiz' />
        </div>

        {/* {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>} */}

        <div className='form-group'>
          <label>Fecha de Vencimiento (MM/AA)</label>
          <div id='card-expiry-id' className='input-niubiz' />
          {/* {errors.expiry && <div className="error-message">{errors.expiry}</div>} */}
        </div>

        <div className='form-group'>
          <label>Código de Seguridad (CVV)</label>
          <div id='card-cvc-id' className='input-niubiz' />
        </div>

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

      {hasError && <div>Ocurrió un error al cargar el formulario de pago. Por favor, recarga la página.</div>}
    </div>
  );
}
