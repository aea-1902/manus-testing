import React, { createContext, useContext, useState, useCallback } from 'react';
import Toastr from './Toastr';

const ToastrContext = createContext();

export const ToastrProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9); // Simple ID generation
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastrContext.Provider value={{ showToast }}>
      {children}
      <div className="toastr-container">
        {toasts.map((toast) => (
          <Toastr
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastrContext.Provider>
  );
};

export const useToastr = () => {
  const context = useContext(ToastrContext);
  if (context === undefined) {
    throw new Error('useToastr must be used within a ToastrProvider');
  }
  return context;
}; 