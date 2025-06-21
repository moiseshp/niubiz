// Type definitions for the Niubiz SDK global object
declare global {
  interface Window {
    payform?: {
      setConfiguration: (config: INiubizConfiguration) => void;
      createElement: (
        type: string,
        options: ICreateCardElementOptions,
        containerId?: string
      ) => Promise<ICardElementRef>;
      createToken: (elements: ICardElementRef[], userCardData: ICardholderData) => Promise<ICreateTokenResult>;
      resetData: (elements: ICardElementRef[]) => void;
    };
  }
}

export {};
