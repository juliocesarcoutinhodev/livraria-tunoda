import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#C9A44C] text-white hover:bg-[#B8934A] focus:ring-[#C9A44C]/30 shadow-lg hover:shadow-xl",
    secondary:
      "bg-[#2F5D8C] text-white hover:bg-[#274A6F] focus:ring-[#2F5D8C]/30 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-[#2F5D8C] text-[#2F5D8C] hover:bg-[#2F5D8C] hover:text-white focus:ring-[#2F5D8C]/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
