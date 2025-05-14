
import * as React from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  // Initialize with safe defaults to prevent "undefined is not iterable" error
  const safeOptions = React.useMemo(() => 
    Array.isArray(options) ? options : [], 
    [options]
  );
  
  const safeSelected = React.useMemo(() => 
    Array.isArray(selected) ? selected : [],
    [selected]
  );
  
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback((value: string) => {
    if (value === 'none') {
      // If "none" is selected, deselect all other options
      onChange(safeSelected.includes('none') ? [] : ['none']);
    } else {
      // If any other option is selected, remove "none" from selection
      let updatedSelected = safeSelected.filter(s => s !== 'none');
      
      if (updatedSelected.includes(value)) {
        // If already selected, remove it
        updatedSelected = updatedSelected.filter(s => s !== value);
      } else {
        // If not selected, add it
        updatedSelected = [...updatedSelected, value];
      }
      
      onChange(updatedSelected);
    }
  }, [safeSelected, onChange]);

  const handleRemove = React.useCallback((value: string) => {
    onChange(safeSelected.filter(s => s !== value));
  }, [safeSelected, onChange]);

  // Define a fallback for empty options to prevent rendering issues
  const renderOptions = React.useCallback(() => {
    if (safeOptions.length === 0) {
      return (
        <CommandItem value="no-options" disabled>
          No options available
        </CommandItem>
      );
    }
    
    return safeOptions.map((option) => {
      const isSelected = safeSelected.includes(option.value);
      const isNone = option.value === 'none';
      const isDisabled = option.disabled || (isNone ? false : safeSelected.includes('none'));
      
      return (
        <CommandItem
          key={option.value}
          value={option.value}
          onSelect={() => handleSelect(option.value)}
          disabled={isDisabled}
          className={cn(
            isDisabled && "opacity-50 cursor-not-allowed",
            isSelected && "bg-primary-foreground"
          )}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              isSelected ? "opacity-100" : "opacity-0"
            )}
          />
          {option.label}
        </CommandItem>
      );
    });
  }, [safeOptions, safeSelected, handleSelect]);

  const selectedBadges = React.useMemo(() => {
    if (safeSelected.length === 0) return null;
    
    return (
      <div className="p-2 flex flex-wrap gap-1">
        {safeSelected.map((value) => {
          const option = safeOptions.find((opt) => opt.value === value);
          return (
            <Badge
              key={value}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {option?.label ?? value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemove(value)}
              />
            </Badge>
          );
        })}
      </div>
    );
  }, [safeOptions, safeSelected, handleRemove]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {safeSelected.length > 0
            ? `${safeSelected.length} option${safeSelected.length > 1 ? "s" : ""} selected`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {renderOptions()}
          </CommandGroup>
        </Command>
        {selectedBadges}
      </PopoverContent>
    </Popover>
  );
}
