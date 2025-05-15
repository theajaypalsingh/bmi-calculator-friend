
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type CheckboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface CheckboxListProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function CheckboxList({
  options,
  selected,
  onChange,
  className,
}: CheckboxListProps) {
  // Initialize with safe defaults
  const safeOptions = React.useMemo(() => 
    Array.isArray(options) ? options : [], 
    [options]
  );
  
  const safeSelected = React.useMemo(() => 
    Array.isArray(selected) ? selected : [],
    [selected]
  );

  const handleSelect = React.useCallback((value: string, checked: boolean) => {
    if (value === 'none') {
      // If "none" is selected, deselect all other options
      onChange(checked ? ['none'] : []);
    } else {
      // If any other option is selected, remove "none" from selection
      let updatedSelected = safeSelected.filter(s => s !== 'none');
      
      if (checked) {
        // If checked, add it to selection
        updatedSelected.push(value);
      } else {
        // If unchecked, remove it
        updatedSelected = updatedSelected.filter(s => s !== value);
      }
      
      onChange(updatedSelected);
    }
  }, [safeSelected, onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {safeOptions.map((option) => {
        const isSelected = safeSelected.includes(option.value);
        const isNone = option.value === 'none';
        const isDisabled = option.disabled || 
          (!isNone && safeSelected.includes('none'));
        
        return (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox 
              id={option.value}
              checked={isSelected}
              disabled={isDisabled}
              onCheckedChange={(checked) => handleSelect(option.value, !!checked)}
            />
            <label 
              htmlFor={option.value} 
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}
