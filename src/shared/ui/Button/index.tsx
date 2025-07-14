// 사용예:
// <div className="flex gap-4">
//   <Button variant="tertiary" size="small" leftIcon={null} rightIcon={null}>Button</Button>
//   <Button variant="tertiary" size="medium" leftIcon={null} rightIcon={null}>Button</Button>
// </div>

"use client";

import React from "react";
import { ExpandIcon } from "@/shared/ui/icons/ExpandIcon";

type ButtonVariant =
  | "default"
  | "outlined"
  | "primary"
  | "negative"
  | "secondary"
  | "tertiary";
type ButtonSize = "small" | "medium";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "small",
  leftIcon = <ExpandIcon />,
  rightIcon = <ExpandIcon />,
  onClick = () => console.log("Button clicked!"),
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "inline-flex justify-center items-center shrink-0 rounded-[9px] cursor-pointer transition-all duration-150 active:scale-95";

  const sizeClasses: Record<ButtonSize, string> = {
    small: "h-[30px] px-[7px] py-2 gap-[2px]",
    medium: "h-[38px] p-[10px] gap-1",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    default: "bg-fill-primary",
    outlined: "border border-stroke-primary bg-transparent",
    primary: "bg-accent-primary",
    negative: "bg-status-danger",
    secondary: "bg-accent-transparent",
    tertiary: "border border-accent-primary bg-transparent",
  };

  const textColorClasses: Record<ButtonVariant, string> = {
    default: "text-content-primary",
    outlined: "text-content-primary",
    primary: "text-content-invert",
    negative: "text-content-invert",
    secondary: "text-accent-primary",
    tertiary: "text-accent-primary",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${textColorClasses[variant]} ${className}`;

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {leftIcon}
      <span
        className="text-[13px] font-normal leading-5 tracking-[-0.26px]"
        style={{ fontFamily: "Pretendard" }}
      >
        {children}
      </span>
      {rightIcon}
    </button>
  );
};
