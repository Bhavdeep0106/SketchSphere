"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" |"secondary" ; 
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm";
  children: ReactNode;
}

export const Button = ({ children, className, onClick, variant, size }: ButtonProps) => {
  return (
    <button
      className={`${className}
        ${variant === "primary" ? "bg-primary" : variant == "secondary" ? "bg-seconadry-foreground shadow-sm hover:bg-secondary/80" : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"}
        $(size === "lg" ? "px-4 py-2" : "px-2 py-1")
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
