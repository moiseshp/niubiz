import { useEffect, useRef, useState } from 'react';
import { loadSdk } from '@/libs/niubiz/loadSdk';
import { NIUBIZ_FIELDS_CONFIG } from '@/libs/niubiz/config';

export type NiubizHook = {
  isReady: boolean;
  hasError: boolean;
  tokenizeCard: () => Promise<any>;
};

interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

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

export function useNiubiz(): NiubizHook {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
  const isInitialized = useRef(false);

    const cardNumberRef = useRef<any>(null);
  const cardExpiryRef = useRef<any>(null);
  const cardCvcRef = useRef<any>(null);

    const [bin, setBin] = useState<string | null>(null);
  const [lastFourDigits, setLastFourDigits] = useState<string | null>(null);

  useEffect(() => {
    const cleanup = loadSdk({
      onLoad: async () => {
            if (!window.payform || isInitialized.current) {
      console.error('Niubiz script not loaded');
      return;
    }
          try {
                window.payform.setConfiguration({
      // callbackurl: 'paginaRespuesta',
      sessionkey: '83dfd9ab8ded813be2c98c07cd749345a92f30dddef5b0b81cf9cc8730703478',
      channel: 'paycard',
      merchantid: '110777209',
      purchasenumber: '12345',
      amount: 20,
      language: 'es',
      font: 'https://fonts.googleapis.com/css?family=Montserrat:400&display=swap'
    });
            // Inicializar el formulario
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
      const cardExpiry =await  window.payform.createElement('card-expiry', {
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
            isInitialized.current = true;
            setIsReady(true);
          } catch (error) {
            console.error('Error al configurar Niubiz:', error);
            setHasError(true);
          }
        },
      onError: (e) => {
        console.error('No se pudo cargar el SDK de Niubiz:', e);
        setHasError(true);
      },
    });

    return () => {
      cleanup();
    };
  }, []);

  const tokenizeCard = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.payform) {
        reject(new Error('Niubiz SDK no está disponible.'));
        return;
      }

      window.payform.createToken((response: any) => {
        if (response.object === 'error') {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  };

  return { isReady, hasError, tokenizeCard };
}
