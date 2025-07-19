'use client';
import { useNiubiz, elementInputs, defaultConfiguration } from '@/libs/niubiz';
import { niubizService } from '@/libs/niubiz/NiubizService';

/**
 * This is a simple example of how to use the Niubiz SDK in a React application.
 *
 * @see {@link https://desarrolladores.niubiz.com.pe/docs/desacoplado#inclusion-del-sdk Niubiz SDK - SDK Inclusion}
 */
export default function Home() {
  const { isLoading, error, fields, isValid } = useNiubiz({
    configuration: defaultConfiguration
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !isValid) return;
    try {
      const data = await niubizService.createToken({
        name: 'Moises',
        lastName: 'Huaringa',
        email: 'prueba.test.sbk93@yopmail.com',
        amount: 20,
        alias: 'prueba.test.sbk93@yopmail.com',
        userBlockId: 'UUID-12346'
      });

      console.info('transactionToken:', data);
      niubizService.resetFields();
    } catch (error) {
      console.error('Error al tokenizar la tarjeta:', { error });
    }
  };

  return (
    <div className='niubiz-payment-form'>
      {isLoading && <div>Cargando Niubiz form...</div>}

      <form onSubmit={handleSubmit} style={{ display: isLoading ? 'none' : 'flex' }}>
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

        {Boolean(fields.cardNumber.installments?.length) && (
          <div className='form-group'>
            <label>Cuotas</label>
            <select className='input-niubiz'>
              {fields.cardNumber.installments?.map(installment => (
                <option key={installment} value={installment}>
                  {installment}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <button type='submit' className='submit-button'>
            Pagar
          </button>
          <button type='button' onClick={() => niubizService.resetFields()} className='reset-button'>
            Limpiar Formulario
          </button>
        </div>
      </form>

      {error && <div className='error-message'>{error}</div>}
    </div>
  );
}
