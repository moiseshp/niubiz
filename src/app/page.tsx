'use client';
import { useState } from 'react';
import { useNiubiz } from '@/libs/niubiz/useNiubiz';

export default function Home() {
  const { isReady, hasError, tokenizeCard } = useNiubiz();
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

      <form onSubmit={handleSubmit} style={{ display: isReady ? 'block' : 'none' }}>
        <div className='form-group'>
          <label>Número de Tarjeta</label>
          <div id='card-number-id' className='input-niubiz' />
        </div>

        {/* {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>} */}

        <div className='form-row'>
          <label>Fecha de Vencimiento (MM/AA)</label>
          <div id='card-expiry-id' className='input-niubiz' />
          {/* {errors.expiry && <div className="error-message">{errors.expiry}</div>} */}
        </div>

        <div className='form-row'>
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
