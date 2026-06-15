"use client";

import type { ReactNode } from "react";

type ConfirmSubmitButtonProps = {
  confirmMessage: string;
  className?: string;
  children: ReactNode;
};

export function ConfirmSubmitButton({ confirmMessage, className, children }: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
