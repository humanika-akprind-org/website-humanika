// types/index.ts

// Toast UI Variants (for appearance)
export type ToastVariant = "success" | "error" | "warning" | "info" | "default" | "destructive";

// Toast Action Types (if you want them centralized)
export const toastActions = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

export type ToastActionType = keyof typeof toastActions;

// Toast Component Props
export interface ToastProps {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Toast Action Element (button, etc)
export type ToastActionElement = React.ReactElement;
