
import { useState } from 'react';
  
interface Props {
  onLoad?: () => void;
  onUnload?: () => void;
}
 
export const useNiubizScript = ({ onLoad, onUnload }: Props = {}) => {
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
 
  const loadNiubizScript = () => {
    if (!window || !document) return;
 
    const script = document.createElement('script');
    script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js';
 
    const scriptExists = document.querySelector(`script[src="https://pocpaymentserve.s3.amazonaws.com/payform.min.js"]`);
 
    if (scriptExists) {
      document.body.removeChild(scriptExists);
    }
 
    setIsLoadingScript(true);
    document.body.appendChild(script);
 
    script.onload = () => {
      setIsLoadingScript(false);
      setIsScriptLoaded(true);
      onLoad?.();
    };
  };
 
  const unloadNiubizScript = () => {
    const scriptExists = document.querySelector(`script[src="https://pocpaymentserve.s3.amazonaws.com/payform.min.js"]`);
 
    if (scriptExists) {
      document.body.removeChild(scriptExists);
      setIsLoadingScript(false);
      setIsScriptLoaded(false);
      onUnload?.();
    }
  };
 
  return { loadNiubizScript, unloadNiubizScript, isLoadingScript, isScriptLoaded };
};