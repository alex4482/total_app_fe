import * as React from 'react';

import { cn } from '@/util/utils.ts';
import * as ProgressPrimitive from '@radix-ui/react-progress';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  value = value || 0;
  let indicatorClass = 'progressFirst';

  if (value <= 20) {
    indicatorClass = 'bg-progressFirst';
  } else if (value <= 40) {
    indicatorClass = 'bg-progressSecond';
  } else if (value <= 60) {
    indicatorClass = 'bg-progressThird';
  } else if (value <= 80) {
    indicatorClass = 'bg-progressFourth';
  } else if (value <= 100) {
    indicatorClass = 'bg-progressFifth';
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-muted',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 ${indicatorClass} transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
