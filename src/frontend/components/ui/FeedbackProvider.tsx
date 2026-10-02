import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Notice } from './PageState';

type Feedback = { notify: (message: string) => void; confirm: (message: string) => Promise<boolean> };
const FeedbackContext = createContext<Feedback | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const resolve = useRef<((answer: boolean) => void) | null>(null);
  function answer(value: boolean) { resolve.current?.(value); resolve.current = null; setQuestion(''); }
  function confirm(text: string) {
    resolve.current?.(false);
    setQuestion(text);
    return new Promise<boolean>(done => { resolve.current = done; });
  }
  return <FeedbackContext.Provider value={{ notify: setMessage, confirm }}>
    {children}
    {message && <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-xl rounded-lg bg-white shadow-lg"><div className="relative pr-9"><Notice>{message}</Notice><button type="button" aria-label="Dismiss message" className="icon-button absolute right-0 top-1" onClick={() => setMessage('')}><X size={16} /></button></div></div>}
    <Dialog open={!!question} onClose={() => answer(false)} title="Confirm action" description={question} footer={<><Button variant="secondary" onClick={() => answer(false)}>Go back</Button><Button onClick={() => answer(true)}>Confirm</Button></>}><p className="text-sm text-gray-500">Please check the details before continuing.</p></Dialog>
  </FeedbackContext.Provider>;
}

// Shared feedback is kept here so messages survive navigation after a save.
// eslint-disable-next-line react-refresh/only-export-components
export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useFeedback requires FeedbackProvider');
  return context;
}
