// Type definitions for the Niubiz SDK global object
declare global {
  interface Window {
    payform?: {
      setConfiguration: (config: any) => void;
      createToken: (callback: (response: any) => void) => void;
      createElement: (type: string, options: any, containerId?: string) => Promise<any>;
      resetData: (elements: any[]) => void;
      checkout?: {
        setup: (options: any) => void;
      };
    };
  }
}

export {};