'use client';
import { useEffect, useState } from 'react';
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
        
    <div className="niubiz-payment-form">
      <h2>Pago con Tarjeta</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de Tarjeta</label>
          <div id="txtNumeroTarjeta"></div>
          {/* {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>} */}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha de Vencimiento (MM/AA)</label>
            <div id="txtFechaVencimiento"></div>
            {/* {errors.expiry && <div className="error-message">{errors.expiry}</div>} */}
          </div>

          <div className="form-group">
            <label>Código de Seguridad (CVV)</label>
            <div id="txtCvv"></div>
            {/* {errors.cvc && <div className="error-message">{errors.cvc}</div>} */}
          </div>
        </div>

        {/* <button 
          type="submit" 
          disabled={isLoading || Object.values(errors).some(error => error)}
          className="submit-button"
        >
          {isLoading ? 'Procesando...' : `Pagar S/ ${amount.toFixed(2)}`}
        </button> */}

        <button 
          type="button" 
          // onClick={resetForm}
          className="reset-button"
        >
          Limpiar Formulario
        </button>
      </form>

        {hasError && (
          <div>
            Ocurrió un error al cargar el formulario de pago. Por favor, recarga la página.
          </div>
        )}
    </div>
  );
}
