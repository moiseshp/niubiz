import { ICardElementRef, IElementStyles, ElementKey } from './types';

export async function createCardElement({
  placeholder,
  elementKey,
  elementId,
  events,
  elementStyles
}: {
  placeholder: string;
  elementKey: ElementKey;
  elementId: string;
  events: Record<string, (data: unknown) => void>;
  elementStyles: IElementStyles;
}): Promise<ICardElementRef> {
  if (!window.payform) return Promise.reject(new Error('Niubiz SDK not loaded'));

  const element = await window.payform.createElement(elementKey, { style: elementStyles, placeholder }, elementId);
  console.info({ element });
  for (const [eventName, handler] of Object.entries(events)) {
    element.on(eventName, handler);
  }

  return element;
}
