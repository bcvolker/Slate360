
import * as React from "react";

import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    const baseStyles = 'px-4 py-2 rounded font-semibold transition';
    const variantStyles = {
      default: 'bg-slate360-blue text-white hover:bg-slate360-copper',
      ghost: 'bg-transparent text-slate360-blue hover:bg-slate360-copper',
      outline: 'border border-slate360-blue text-slate360-blue hover:bg-slate360-copper',
    };

    return (
      <button
        className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


export { Button };