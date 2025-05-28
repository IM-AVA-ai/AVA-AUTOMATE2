// This file contains the code for the common component  modal component.

// components/ui/Modal.tsx
'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  moduleType: string;
  children: ReactNode;
  cancelButtonClassName?: string;
  className?: string;
  okButtonClassName?: string;
  centered?: boolean;
  focusTriggerAfterClose?: boolean;
}

export const Modal = ({
  isOpen,
  onCancel,
  onOk,
  moduleType,
  children,
  cancelButtonClassName = '',
  className = '',
  okButtonClassName = '',
  centered = false,
  focusTriggerAfterClose = false,
}: ModalProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (!isOpen && focusTriggerAfterClose && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, focusTriggerAfterClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex ${centered ? 'items-center justify-center' : 'items-start pt-16 justify-center'} bg-black/50`}
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {moduleType}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            ref={triggerRef}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
        
        {(onCancel || onOk) && (
          <div className="flex justify-end gap-2 mt-6">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className={cancelButtonClassName}
              >
                Cancel
              </Button>
            )}
            {onOk && (
              <Button
                onClick={onOk}
                className={okButtonClassName}
              >
                OK
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};