// Type definitions for the Niubiz SDK global object
declare global {
  interface Window {
    payform?: {
      setConfiguration: (config: IConfiguration) => void;
      createElement: (type: string, options: ICreateElementOptions, containerId?: string) => Promise<ICardElementRef>;
      createToken: (elements: ICardElementRef[], userCardData: IUserCardData) => Promise<ICreateTokenResponse>;
      resetData: (elements: ICardElementRef[]) => void;
    };
  }
}

export {};
