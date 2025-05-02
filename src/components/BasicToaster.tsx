'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'; // Icons for different toast types

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning'; // Add success/warning
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

// Hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Provide a dummy implementation or throw error if used outside provider
    console.warn("useToast used outside of ToastProvider. Returning dummy implementation.");
    return {
      toast: (options: Omit<ToastMessage, 'id'>) => {
        console.log("Dummy toast:", options);
        // Optionally, show a simple alert as fallback
        // alert(`${options.title}\n${options.description || ''}`);
      },
      dismiss: () => { console.log("Dummy dismiss called"); } // Add dummy dismiss
    };
    // Or throw new Error('useToast must be used within a ToastProvider');
  }
  // Add a dismiss function here if needed, though this basic example auto-dismisses
   return {
     toast: context.addToast,
     dismiss: () => { console.log("Dismiss function called - not implemented in this basic toaster"); }
   };
};


// Provider component to wrap the app
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = toastIdCounter++;
    setToasts(currentToasts => [...currentToasts, { ...toast, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Render the toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => setToasts(current => current.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Individual Toast Item Component
function ToastItem({ toast, onClose }: { toast: ToastMessage, onClose: () => void }) {
  const getStyles = () => {
    switch (toast.variant) {
      case 'destructive':
        return { bg: 'bg-red-500', text: 'text-white', icon: <XCircle className="h-5 w-5" /> };
      case 'success':
        return { bg: 'bg-green-500', text: 'text-white', icon: <CheckCircle className="h-5 w-5" /> };
      case 'warning':
        return { bg: 'bg-yellow-500', text: 'text-gray-900', icon: <AlertTriangle className="h-5 w-5" /> };
      default:
        return { bg: 'bg-gray-800', text: 'text-white', icon: <Info className="h-5 w-5" /> }; // Default darkish background
    }
  };

  const { bg, text, icon } = getStyles();

  return (
    <div className={`flex items-start p-4 rounded-md shadow-lg w-full max-w-sm ${bg} ${text} animate-toast-in`}>
      <div className="flex-shrink-0 mr-3 pt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && <p className="mt-1 text-sm opacity-90">{toast.description}</p>}
      </div>
      <button onClick={onClose} className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white">
        <XCircle className="h-5 w-5" />
      </button>
      <style jsx>{`
        @keyframes toast-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-toast-in {
          animation: toast-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}


// Default export for the file, can be the Provider or the Toaster container
export default function BasicToaster() {
    // This component is just a placeholder if the provider is used elsewhere.
    // The actual rendering happens within the ToastProvider.
    // We keep this structure if BasicToaster is rendered directly in layout.tsx
    // but the actual logic relies on the context provider wrapping the app.
    // For this setup, ToastProvider should wrap the children in layout.tsx
    return null; // The provider handles rendering
}

// Re-export useToast if needed elsewhere
// export { useToast }; -- Already exported above
