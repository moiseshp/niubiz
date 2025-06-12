type LoadNiubizOptions = {
  onLoad: () => void;
  onError?: (error: any) => void;
};

export function loadSdk({ onLoad, onError }: LoadNiubizOptions): () => void {
  let script: HTMLScriptElement | null = null;
  let link: HTMLLinkElement | null = null;

  const scriptId = 'niubiz-sdk';
  const styleId = 'niubiz-style';

  if (!document.getElementById(styleId)) {
    link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';
    link.href = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.css';
    document.head.appendChild(link);
  
  }

  if (!document.getElementById(scriptId)) {
    script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js';
    script.async = true;
    script.onload = onLoad;
    script.onerror = (e: any) => {
      if (onError) onError(e);
    };
    document.body.appendChild(script);
  } else {
    onLoad();
  }

  return () => {
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };
}
