export {};

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      config?: {
        send_to?: string;
        transaction_id?: string;
        new_customer?: boolean;
        [key: string]: unknown;
      }
    ) => void;
    dataLayer?: unknown[];
  }
}
