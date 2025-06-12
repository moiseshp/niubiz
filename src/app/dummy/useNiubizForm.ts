import { useEffect, useRef, useState } from 'react';

interface UseNiubizFormProps {
  sessionToken: string;
  merchantId: string;
  amount: number;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export const useNiubizForm = ({
  sessionToken,
  merchantId,
  amount,
  onSuccess,
  onError,
}: UseNiubizFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.payform) return;

    const initializeForm = () => {
      try {
        window.payform.checkout.setup({
          sessiontoken: sessionToken,
          merchantid: merchantId,
          merchantlogo: 'img/your-logo.png', // Update with your logo path
          form: formRef.current,
          amount: amount,
          action: 'pay',
          onSuccess: (response: any) => {
            setIsLoading(false);
            onSuccess(response);
          },
          onError: (error: any) => {
            setIsLoading(false);
            onError(error);
          },
          onLoad: () => {
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error('Error initializing Niubiz form:', error);
        onError(error);
      }
    };

    initializeForm();

    return () => {
      // Cleanup if needed
    };
  }, [sessionToken, merchantId, amount, onSuccess, onError]);

  return { formRef, isLoading };
};