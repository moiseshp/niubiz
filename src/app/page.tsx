'use client';
import { useState } from 'react';
import { useNiubiz, INiubizConfiguration, elementInputs } from '@/libs/niubiz';

/**
 * Para obtener el sessionKey llamar a la solicitud:
 * /v1/user/order/create-order
 */

const configuration: INiubizConfiguration = {
  sessionkey: 'f51e596e658833ab4d3e9365c1d358f0a07bb4d0161c36d88eaeedd5a5c7b127',
  channel: 'web',
  merchantid: '110777209',
  purchasenumber: 12345,
  amount: 20,
  language: 'es',
  font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap'
};

export default function Home() {
  const { isReady, error, fields, isValid, resetFields, getTransactionToken } = useNiubiz({
    configuration
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info('isValid', isValid);
    if (!isReady) return;
    if (!isValid) return;
    setIsLoading(true);
    try {
      const data = await getTransactionToken({
        name: 'Moises',
        lastName: 'Huaringa',
        email: 'prueba.test.sbk93@yopmail.com',
        amount: 20,
        alias: 'prueba.test.sbk93@yopmail.com',
        userBlockId: 'UUID-12346'
      });

      resetFields();
      /**
       * TODO: Revisar el endpoint de /v1/user/order/complete-order
       */
      console.info('Response Create Token:', data);
    } catch (error) {
      console.error('Error al tokenizar la tarjeta:', { error });
      // Manejar el error (mostrar mensaje al usuario, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='niubiz-payment-form'>
      {!isReady && <div>Cargando Niubiz form...</div>}

      <form onSubmit={handleSubmit} style={{ display: isReady ? 'flex' : 'none' }}>
        <div className='form-group'>
          <label>Número de Tarjeta</label>
          <div id={elementInputs.cardNumber.id} className='input-niubiz' />
          {fields.cardNumber.error && <span className='error-message'>{fields.cardNumber.error}</span>}
        </div>

        <div className='form-group'>
          <label>Fecha de Vencimiento (MM/AA)</label>
          <div id={elementInputs.cardExpiry.id} className='input-niubiz' />
          {fields.cardExpiry.error && <span className='error-message'>{fields.cardExpiry.error}</span>}
        </div>

        <div className='form-group'>
          <label>Código de Seguridad (CVV)</label>
          <div id={elementInputs.cardCvc.id} className='input-niubiz' />
          {fields.cardCvc.error && <span className='error-message'>{fields.cardCvc.error}</span>}
        </div>

        <div>
          <button type='submit' className='submit-button'>
            Pagar
          </button>
          <button type='button' onClick={resetFields} className='reset-button'>
            Limpiar Formulario
          </button>
        </div>
      </form>

      {error && <div>Ocurrió un error al cargar el formulario de pago. Por favor, recarga la página.</div>}
    </div>
  );
}
