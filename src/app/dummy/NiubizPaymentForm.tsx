import { useEffect, useRef, useState } from 'react';
import '@/types/niubiz';

interface PaymentFormProps {
  amount: number;
  merchantId: string;
  purchaseNumber: string;
  onPaymentSuccess: (response: any) => void;
  onPaymentError: (error: any) => void;
}

interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

export default function NiubizPaymentForm({
  amount,
  merchantId,
  purchaseNumber,
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const [bin, setBin] = useState<string | null>(null);
  const [lastFourDigits, setLastFourDigits] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Referencias a los elementos del formulario
  const cardNumberRef = useRef<any>(null);
  const cardExpiryRef = useRef<any>(null);
  const cardCvcRef = useRef<any>(null);

  // Estilos para los elementos del formulario
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

  useEffect(() => {
    // Cargar el script de Niubiz
    const script = document.createElement('script');
    script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js';
    script.async = true;
    script.onload = initializeNiubiz;

    // Cargar el CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.css';

    document.head.appendChild(link);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  const initializeNiubiz = async () => {
    if (!window.payform) {
      console.error('Niubiz script not loaded');
      return;
    }

    // Configuración inicial
    window.payform.setConfiguration({
      callbackurl: 'paginaRespuesta',
      sessionkey: 'ff947276a9c807937d2f942ea8529719c06e9b24aeb1fe44cd804831059cb5c8',
      channel: 'paycard',
      merchantid: merchantId,
      purchasenumber: purchaseNumber,
      amount: amount,
      language: 'es',
      font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap'
    });

    // Crear elementos del formulario
    try {
      // Elemento para número de tarjeta
      const cardNumber = await window.payform.createElement('card-number', {
        style: elementStyles,
        placeholder: 'Número de tarjeta'
      }, 'txtNumeroTarjeta');

      cardNumberRef.current = cardNumber;
      
      cardNumber.on('bin', (data: string) => {
        setBin(data);
        console.log('BIN:', data);
      });

      cardNumber.on('change', (data: any[]) => {
        const newErrors = { ...errors };
        const cardError = data.find(e => e.code === 'invalid_number');
        newErrors.cardNumber = cardError?.message || undefined;
        setErrors(newErrors);
      });

      cardNumber.on('lastFourDigits', (data: string) => {
        setLastFourDigits(data);
        console.log('Últimos 4 dígitos:', data);
      });

      // Elemento para fecha de vencimiento
      const cardExpiry = await window.payform.createElement('card-expiry', {
        style: elementStyles,
        placeholder: 'MM/YY'
      }, 'txtFechaVencimiento');

      cardExpiryRef.current = cardExpiry;

      cardExpiry.on('change', (data: any[]) => {
        const newErrors = { ...errors };
        const expiryError = data.find(e => e.code === 'invalid_expiry');
        newErrors.expiry = expiryError?.message || undefined;
        setErrors(newErrors);
      });

      // Elemento para CVV
      const cardCvc = await window.payform.createElement('card-cvc', {
        style: elementStyles,
        placeholder: 'CVC'
      }, 'txtCvv');

      cardCvcRef.current = cardCvc;

      cardCvc.on('change', (data: any[]) => {
        const newErrors = { ...errors };
        const cvcError = data.find(e => e.code === 'invalid_cvc');
        newErrors.cvc = cvcError?.message || undefined;
        setErrors(newErrors);
      });

    } catch (error) {
      console.error('Error al crear elementos de pago:', error);
      onPaymentError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar que no haya errores antes de proceder
    if (Object.values(errors).some(error => error)) {
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría la lógica para procesar el pago con los datos tokenizados
      // En una implementación real, usarías el token generado para hacer el cargo
      console.log('Procesando pago con BIN:', bin, 'y últimos 4 dígitos:', lastFourDigits);
      
      // Simulamos una respuesta exitosa después de 1.5 segundos
      setTimeout(() => {
        onPaymentSuccess({
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
          amount: amount,
          cardLastFour: lastFourDigits,
          bin: bin
        });
        setIsLoading(false);
        resetForm();
      }, 1500);

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      onPaymentError(error);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (window.payform && cardNumberRef.current && cardExpiryRef.current && cardCvcRef.current) {
      window.payform.resetData([cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current]);
    }
    setBin(null);
    setLastFourDigits(null);
    setErrors({});
  };

  return (
    <div className="niubiz-payment-form">
      <h2>Pago con Tarjeta</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de Tarjeta</label>
          <div id="txtNumeroTarjeta" className="card-input"></div>
          {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha de Vencimiento (MM/AA)</label>
            <div id="txtFechaVencimiento" className="card-input"></div>
            {errors.expiry && <div className="error-message">{errors.expiry}</div>}
          </div>

          <div className="form-group">
            <label>Código de Seguridad (CVV)</label>
            <div id="txtCvv" className="card-input"></div>
            {errors.cvc && <div className="error-message">{errors.cvc}</div>}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || Object.values(errors).some(error => error)}
          className="submit-button"
        >
          {isLoading ? 'Procesando...' : `Pagar S/ ${amount.toFixed(2)}`}
        </button>

        <button 
          type="button" 
          onClick={resetForm}
          className="reset-button"
        >
          Limpiar Formulario
        </button>
      </form>

      {/* Mostrar información de la tarjeta si está disponible */}
      {bin && (
        <div className="card-info">
          <p>BIN: {bin}</p>
          {lastFourDigits && <p>Terminación: **** **** **** {lastFourDigits}</p>}
        </div>
      )}
    </div>
  );
}