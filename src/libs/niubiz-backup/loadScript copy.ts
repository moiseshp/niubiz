let scriptLoaded = false;
let loadingPromise: Promise<void> | null = null;
let cleanupFn: (() => void) | null = null;

export function loadScript(onLoad: () => void): () => void {
  // If already loaded, call onLoad immediately
  if (scriptLoaded) {
    onLoad();
    return () => {}; // No-op cleanup since we're not creating new elements
  }

  // If already loading, just add to the callback queue
  if (loadingPromise) {
    loadingPromise.then(onLoad);
    return () => {}; // Return no-op cleanup
  }

  // Create a new promise to track loading state
  loadingPromise = new Promise<void>(resolve => {
    const script = document.createElement('script');
    script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js';
    script.async = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.css';

    const onScriptLoad = () => {
      scriptLoaded = true;
      loadingPromise = null;
      onLoad();
      resolve();
    };

    script.onload = onScriptLoad;
    script.onerror = (e: any) => {
      console.error('Failed to load Niubiz script', e);
      loadingPromise = null;
    };

    document.body.appendChild(script);
    document.head.appendChild(link);

    cleanupFn = () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (link.parentNode) {
        document.head.removeChild(link);
      }
      scriptLoaded = false;
      cleanupFn = null;
    };
  });

  // Return cleanup function that will be called when component unmounts
  return () => {
    if (cleanupFn) {
      cleanupFn();
      cleanupFn = null;
    }
  };
}
