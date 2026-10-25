import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, TextInput, type TextInputInstance } from 'react-native';

const Input = React.forwardRef<
  TextInputInstance,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'bg-white border-neutral-200 text-neutral-900 flex h-12 w-full min-w-0 flex-row items-center rounded-xl border px-3.5 py-1 text-sm leading-5 shadow-sm shadow-black/5',
        props.editable === false &&
        cn(
          'opacity-50',
          Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
        ),
        Platform.select({
          web: cn(
            'placeholder:text-neutral-400 selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow]',
            'focus-visible:border-neutral-900 focus-visible:ring-neutral-900/10 focus-visible:ring-[2px]',
            'aria-invalid:ring-destructive/20 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-neutral-400',
        }),
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
