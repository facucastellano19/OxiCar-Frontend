import React, { type ReactNode } from "react";
import { boolean } from "zod";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
};
