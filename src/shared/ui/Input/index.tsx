"use client"
import React, { useState } from 'react';
import { CloseIcon } from '@/shared/ui/icons/CloseIcon';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder = "Enter your ID",
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const baseClasses = 'flex w-[305px] h-[38px] px-3 items-center shrink-0 rounded-[11px] text-[13px] font-normal leading-5 tracking-[-0.26px] outline-none transition-all';
  
  const stateClasses = isFocused 
    ? 'justify-between border-[1.5px] border-[#864EF6] text-[#2F3238]'
    : 'border border-[#E9EAED] text-[#8F96A3]';

  const classes = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className={classes}>
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-inherit"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        style={{ fontFamily: 'Pretendard' }}
      />
      {isFocused && inputValue && (
        <button
          onClick={handleClear}
          className="text-[#2F3238] hover:opacity-70"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};