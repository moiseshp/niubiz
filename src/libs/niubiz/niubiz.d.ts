// Type definitions for the Niubiz SDK global object
declare global {
  interface Window {
    payform?: {
      setConfiguration: (config: IConfiguration) => void;
      createElement: (type: string, options: ICreateElementOptions, containerId?: string) => Promise<ICardElement>;
      createToken: (elements: ICardElement[], userCardData: IUserCardData) => Promise<ICreateTokenResponse>;
      resetData: (elements: ICardElement[]) => void;
    };
  }
}

export {};
