"use client"

import React, { useState } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'loading';
}

type ToastType = 'success' | 'error' | 'loading';

export const ToastContext = React.createContext<{
  addMessage: (message: string, type: ToastType) => void;
  dismiss: () => void;
}>({
  addMessage: () => {},
  dismiss: () => {}
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addMessage = (message: string, type: ToastType) => {
    const newMessage = {
      id: Date.now(),
      message,
      type,
    };
    setMessages(prev => [...prev, newMessage]);

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 3000);
  };

  const dismiss = () => {
    setMessages([]);
  };

  return (
    <ToastContext.Provider value={{ addMessage, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-center p-4 rounded-lg shadow-lg mb-2 ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : message.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            <span className="ml-2">{message.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const { addMessage, dismiss } = React.useContext(ToastContext);
  return {
    addMessage,
    dismiss,
    success: (message: string) => addMessage(message, 'success'),
    error: (message: string) => addMessage(message, 'error'),
    loading: (message: string) => addMessage(message, 'loading')
  };
}
