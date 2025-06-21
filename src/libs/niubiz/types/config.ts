/**
 * Configuration parameters required to initialize the Niubiz payment session.
 */
export interface INiubizConfiguration {
  sessionkey: string;
  channel: string;
  merchantid: string;
  purchasenumber: number;
  amount: number;
  language: string;
  font: string;
}
