let scriptLoaded = false;
let loadingPromise: Promise<void> | null = null;

const sdk = {
  js: process.env.NEXT_PUBLIC_NIUBIZ_JS ?? '',
  css: process.env.NEXT_PUBLIC_NIUBIZ_CSS ?? ''
};

export function loadSdk(onLoad: () => void): () => void {
  if (scriptLoaded) {
    onLoad();
    return () => {};
  }

  if (loadingPromise) {
    loadingPromise.then(onLoad);
    return () => {};
  }

  loadingPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = sdk.js;
    script.async = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = sdk.css;

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

  const cleanup = () => {
    const script = document.querySelector(`script[src="${sdk.js}"]`);
    const link = document.querySelector(`link[href="${sdk.css}"]`);

    if (script) document.body.removeChild(script);
    if (link) document.head.removeChild(link);

    scriptLoaded = false;
    loadingPromise = null;
  };

  return cleanup;
}
