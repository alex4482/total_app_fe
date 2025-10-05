import * as React from 'react';

import { cn } from '@/util/utils';

export interface TextareatWithIconProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  endIcon?: React.ReactNode;
}

const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareatWithIconProps
>(({ className, endIcon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          endIcon && 'pr-10',
          className
        )}
        ref={ref}
        {...props}
      />
      {endIcon && (
        <div className="absolute bottom-2 right-2 flex items-center">
          {endIcon}
        </div>
      )}
    </div>
  );
});

TextareaField.displayName = 'TextareaField';

export { TextareaField };
