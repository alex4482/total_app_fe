import * as React from 'react';

import { cn } from '@/util/utils.ts';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primaryYellow text-primaryYellow-foreground hover:bg-primaryYellow/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-primary',
        primaryYellow: 'bg-primaryYellow text-secondary-foreground hover:bg-primaryYellow-foreground',
        secondary:
          'bg-primaryBlue text-secondary-foreground hover:bg-primaryBlue-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primaryYellow underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleOnClick = async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        setIsLoading(true);
        if (props.onClick) {
          await props.onClick(event);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={handleOnClick}
        disabled={props.disabled || isLoading}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
