// Estado global para manejar la carga del script
let scriptLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function loadScript(onLoad: () => void): () => void {
  // Si ya está cargado, ejecutar onLoad y retornar no-op cleanup
  if (scriptLoaded) {
    onLoad();
    return () => {};
  }

  // Si ya está en proceso de carga, encolar onLoad
  if (loadingPromise) {
    loadingPromise.then(onLoad);
    return () => {};
  }

  // Cargar el script y CSS por primera vez
  loadingPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js';
    script.async = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.css';

    script.onload = () => {
      scriptLoaded = true;
      loadingPromise = null;
      onLoad();
      resolve();
    };

    script.onerror = error => {
      console.error('Failed to load Niubiz script', error);
      loadingPromise = null;
      reject(error);
    };

    document.body.appendChild(script);
    document.head.appendChild(link);
  });

  // Función de cleanup (elimina los elementos del DOM)
  const cleanup = () => {
    const script = document.querySelector('script[src="https://pocpaymentserve.s3.amazonaws.com/payform.min.js"]');
    const link = document.querySelector('link[href="https://pocpaymentserve.s3.amazonaws.com/payform.min.css"]');

    if (script) document.body.removeChild(script);
    if (link) document.head.removeChild(link);

    scriptLoaded = false;
    loadingPromise = null;
  };

  return cleanup;
}
