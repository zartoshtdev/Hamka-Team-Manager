import { createContext, useContext } from 'react';
export interface ConfirmOptions {
  title: string;
  message: string;
  action?: string;
  danger?: boolean;
  onConfirm: () => void;
}
interface Feedback {
  notify: (text: string, severity?: 'success' | 'error' | 'info') => void;
  run: (action: () => void, success?: string) => boolean;
  confirm: (options: ConfirmOptions) => void;
}
export const FeedbackContext = createContext<Feedback | null>(null);
export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('FeedbackProvider missing');
  return context;
}
