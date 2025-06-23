const sdk = {
  js: process.env.NEXT_PUBLIC_NIUBIZ_JS ?? '',
  css: process.env.NEXT_PUBLIC_NIUBIZ_CSS ?? ''
};

/**
 * Dynamically loads the Niubiz SDK JavaScript and CSS resources into the document.
 * Ensures the SDK is available for use in desacoplado integrations.
 *
 * @see {@link https://desarrolladores.niubiz.com.pe/docs/desacoplado#inclusion-del-sdk Niubiz SDK - SDK Inclusion}
 *
 * @param {() => void} onLoad - Callback function to execute once the SDK has loaded successfully.
 * @returns {() => void} Cleanup function to remove the SDK script and stylesheet from the DOM.
 */
export function loadSdk(onLoad: () => void): () => void {
  const script = document.createElement('script');
  script.src = sdk.js;
  script.async = true;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = sdk.css;

  script.onload = () => {
    onLoad();
  };

  script.onerror = error => {
    console.error('Failed to load Niubiz script', error);
  };

  document.body.appendChild(script);
  document.head.appendChild(link);

  return () => {
    const scriptElement = document.querySelector(`script[src="${sdk.js}"]`);
    const linkElement = document.querySelector(`link[href="${sdk.css}"]`);

    if (scriptElement) document.body.removeChild(scriptElement);
    if (linkElement) document.head.removeChild(linkElement);
  };
}
