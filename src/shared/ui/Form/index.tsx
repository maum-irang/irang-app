'use client'
import React from 'react';
import { Input } from '@/shared/ui/Input';

interface FormProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  inputStatus?: 'default' | 'error';
  inputSize?: 'small' | 'medium';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  label,
  required = false,
  placeholder,
  inputStatus = 'default',
  inputSize = 'medium',
  value,
  onChange,
  errorMessage,
  className = '',
}) => {
  const formClasses = `flex w-[305px] flex-col items-start gap-1 ${className}`;

  return (
    <div className={formClasses}>
      <label 
        className="text-content-primary text-[13px] font-normal leading-5 tracking-[-0.26px]" 
        style={{ fontFamily: 'Pretendard' }}
      >
        {label}
        {required && <span className="text-status-danger ml-1">*</span>}
      </label>
      <Input
        placeholder={placeholder}
        status={inputStatus}
        size={inputSize}
        value={value}
        onChange={onChange}
      />
      {inputStatus === 'error' && errorMessage && (
        <span 
          className="text-status-danger text-[13px] font-normal leading-5 tracking-[-0.26px]"
          style={{ fontFamily: 'Pretendard' }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

// 사용예시:
// <Form label="Label" required placeholder="Enter your ID" />
// <Form 
//   label="Label" 
//   required 
//   placeholder="Enter your ID" 
//   inputStatus="error"
//   errorMessage="ID field is required"
// />
// <Form label="Label" placeholder="Enter your ID" inputStatus="disabled" />