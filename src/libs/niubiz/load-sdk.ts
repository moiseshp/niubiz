const sdk = {
  js: process.env.NEXT_PUBLIC_NIUBIZ_JS ?? '',
  css: process.env.NEXT_PUBLIC_NIUBIZ_CSS ?? ''
};

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
