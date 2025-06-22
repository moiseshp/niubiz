import { ICardElementRef, ICardElementStyles, CardElementKey } from '../types';

export async function createCardElement({
  placeholder,
  elementKey,
  elementId,
  events,
  elementStyles
}: {
  placeholder: string;
  elementKey: CardElementKey;
  elementId: string;
  events: Record<string, (data: unknown) => void>;
  elementStyles: ICardElementStyles;
}): Promise<ICardElementRef> {
  if (!window.payform) return Promise.reject(new Error('Niubiz SDK not loaded'));

  const element = await window.payform.createElement(elementKey, { style: elementStyles, placeholder }, elementId);

  for (const [eventName, handler] of Object.entries(events)) {
    element.on(eventName, handler);
  }

  return element;
}
