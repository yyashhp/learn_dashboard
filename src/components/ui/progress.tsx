import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils/helpers';

interface ProgressProps {
  value?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value = 0, className, indicatorClassName }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700', className)}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full bg-blue-600 transition-all duration-300 ease-in-out', indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
