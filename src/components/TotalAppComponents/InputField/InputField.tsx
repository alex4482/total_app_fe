import * as React from 'react';

import { cn } from '@/util/utils';

export interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  endIcon?: React.ReactNode;
}

export const InputField = React.forwardRef<
  HTMLInputElement,
  InputWithIconProps
>(({ className, endIcon, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <input
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        ref={ref}
        {...props}
      />
      {endIcon && <div className="ml-2 flex items-center">{endIcon}</div>}
    </div>
  );
});

InputField.displayName = 'InputField';
