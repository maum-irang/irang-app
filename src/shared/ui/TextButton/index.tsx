'use client'
import React from 'react';
import { ExpandIcon } from '@/shared/ui/icons/ExpandIcon';

type TextButtonVariant = 'default' | 'primary' | 'danger';
type TextButtonSize = 'small' | 'medium';

interface TextButtonProps {
  children: React.ReactNode;
  variant?: TextButtonVariant;
  size?: TextButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  variant = 'default',
  size = 'small',
  leftIcon = <ExpandIcon />,
  rightIcon = <ExpandIcon />,
  onClick = () => console.log('TextButton clicked!'),
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex justify-center items-center shrink-0 cursor-pointer bg-transparent border-none';
  
  const sizeClasses: Record<TextButtonSize, string> = {
    small: 'h-[30px] px-[7px] py-2 gap-[2px]',
    medium: 'h-[38px] py-[10px] px-0 gap-1',
  };

  const variantClasses: Record<TextButtonVariant, string> = {
    default: 'text-content-secondary',
    primary: 'text-accent-primary',
    danger: 'text-status-danger',
  };

  const textSizeClasses: Record<TextButtonSize, string> = {
    small: 'text-[13px] leading-5 tracking-[-0.26px]',
    medium: 'text-[15px] leading-[23px] tracking-[-0.3px]',
  };

  const iconSizeClasses: Record<TextButtonSize, string> = {
    small: 'w-4 h-4 aspect-square', 
    medium: 'w-4 h-4 aspect-square', 
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && (
        <div className={iconSizeClasses[size]}>
          {leftIcon}
        </div>
      )}
      <span
        className={`${textSizeClasses[size]} font-normal`}
        style={{ fontFamily: 'Pretendard' }}
      >
        {children}
      </span>
      {rightIcon && (
        <div className={iconSizeClasses[size]}>
          {rightIcon}
        </div>
      )}
    </button>
  );
};