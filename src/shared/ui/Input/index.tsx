"use client"
import React, { useState } from 'react';
import { CloseIcon } from '@/shared/ui/icons/CloseIcon';

type InputStatus = 'default' | 'error' | 'disabled';
type InputSize = 'small' | 'medium';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status?: InputStatus;
  size?: InputSize;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder = "글자를 입력하세요",
  value,
  onChange,
  status = 'default',
  size = 'medium',
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

  const isDisabled = status === 'disabled';
  const isError = status === 'error';

  const baseClasses = 'flex w-[305px] items-center gap-[10px] shrink-0 text-[13px] font-normal leading-5 tracking-[-0.26px] outline-none transition-all';
  
  const sizeClasses = {
    small: 'h-[30px] min-h-[30px] max-h-[30px] px-[10px] rounded-[9px]',
    medium: 'h-[38px] px-3 rounded-[11px]',
  };
  
  let stateClasses;
  if (isDisabled) {
    stateClasses = 'border border-stroke-primary opacity-70 bg-fill-primary text-content-secondary cursor-not-allowed';
  } else if (isError) {
    if (isFocused) {
      stateClasses = 'justify-between border-[1.5px] border-status-danger text-content-primary';
    } else {
      stateClasses = 'border border-status-danger text-content-secondary';
    }
  } else {
    if (isFocused) {
      stateClasses = 'justify-between border-[1.5px] border-accent-primary text-content-primary';
    } else {
      stateClasses = 'border border-stroke-primary text-content-secondary';
    }
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${className}`;

  return (
    <div className={classes}>
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-inherit"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => !isDisabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isDisabled}
        style={{ fontFamily: 'Pretendard' }}
      />
      {isFocused && inputValue && !isDisabled && (
        <button
          onClick={handleClear}
          className="text-content-primary hover:opacity-70"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

// 사용예시:
// <Input size="small" status="default" placeholder="Small 입력" />
// <Input size="medium" status="default" placeholder="Medium 입력" />
// <Input size="small" status="error" placeholder="Small Error" />
// <Input size="medium" status="disabled" placeholder="Medium Disabled" />