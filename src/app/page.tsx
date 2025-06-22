'use client';
import { useState } from 'react';
import { useNiubiz, INiubizConfiguration, elementInputs } from '@/libs/niubiz';

/**
 * Para obtener el sessionKey llamar a la solicitud:
 * /v1/user/order/create-order
 */

const configuration: INiubizConfiguration = {
  sessionkey: '12b55f8d2520c20b23643f31751e08ddb44179cba7d6861b492681b41b392a8c',
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
      <h2>Pago con Tarjeta</h2>

      {error && <div>{error}</div>}

      {!isReady && <div>Cargando Niubiz form...</div>}

      <form onSubmit={handleSubmit} style={{ display: isReady ? 'block' : 'none' }}>
        <div className='form-group'>
          <label>Número de Tarjeta</label>
          <div id={elementInputs.cardNumber.id} className='input-niubiz' />
        </div>

        <code>{JSON.stringify(fields.cardNumber, null, 2)}</code>

        {/* {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>} */}

        <div className='form-group'>
          <label>Fecha de Vencimiento (MM/AA)</label>
          <div id={elementInputs.cardExpiry.id} className='input-niubiz' />
          {/* {errors.expiry && <div className="error-message">{errors.expiry}</div>} */}
        </div>

        <code>{JSON.stringify(fields.cardExpiry, null, 2)}</code>

        <div className='form-group'>
          <label>Código de Seguridad (CVV)</label>
          <div id={elementInputs.cardCvc.id} className='input-niubiz' />
        </div>

        <code>{JSON.stringify(fields.cardCvc, null, 2)}</code>

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
