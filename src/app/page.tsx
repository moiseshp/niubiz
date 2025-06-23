'use client';
import { useNiubiz, INiubizConfiguration, elementInputs } from '@/libs/niubiz';

/**
 * This is a simple example of how to use the Niubiz SDK in a React application.
 *
 * @see {@link https://desarrolladores.niubiz.com.pe/docs/desacoplado#inclusion-del-sdk Niubiz SDK - SDK Inclusion}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady || !isValid) return;
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
      console.info('getTransactionToken:', data);
    } catch (error) {
      console.error('Error al tokenizar la tarjeta:', { error });
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

      {error && <div className='error-message'>{error}</div>}
    </div>
  );
}
