"use client"
import React, { useState } from 'react';
import { CheckIcon } from '@/shared/ui/icons/CheckIcon';

interface SelectorOption {
  id: string;
  label: string;
}

interface SelectorProps {
  options: SelectorOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  options,
  selectedId,
  onSelect,
  className = '',
}) => {
  const [selected, setSelected] = useState(selectedId || '');

  const handleSelect = (id: string) => {
    setSelected(id);
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div className={`flex w-[188px] p-[6px] flex-col items-start gap-1 rounded-[12px] bg-white shadow-[0px_0px_10px_0px_#F1F2F5] ${className}`}>
      {options.map((option) => {
        const isSelected = selected === option.id;
        const itemClasses = `flex h-[38px] py-[7px] px-[10px] items-center gap-[10px] self-stretch rounded-[8px] cursor-pointer ${
          isSelected
            ? 'bg-transparent text-accent-primary'
            : 'bg-transparent text-content-secondary'
        }`;

        return (
          <div
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={itemClasses}
          >
            <span
              className="flex-1 text-[15px] font-normal leading-[23px] tracking-[-0.3px]"
              style={{ fontFamily: 'Pretendard' }}
            >
              {option.label}
            </span>
            {isSelected && (
              <div className="text-accent-primary">
                <CheckIcon />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};