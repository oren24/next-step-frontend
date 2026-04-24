/**
 * Custom hook for toast notification state management
 * Encapsulates toast state and methods
 */
import { useState } from 'react';
export function useToastNotification() {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const showToast = ({ message, severity = 'success' }) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };
  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };
  return { toast, showToast, closeToast };
}
