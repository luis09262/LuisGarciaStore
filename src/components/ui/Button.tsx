import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'pine';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      pill = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base geometry constraints: strict heights (38px - 44px for sm/md/lg)
    let sizeClasses = '';
    switch (size) {
      case 'sm':
        sizeClasses = 'h-[38px] px-3.5 text-xs tracking-wide';
        break;
      case 'md':
        sizeClasses = 'h-[42px] px-5 text-sm font-medium';
        break;
      case 'lg':
        sizeClasses = 'h-[44px] px-6 text-sm font-semibold tracking-wide';
        break;
      case 'icon':
        sizeClasses = 'h-[40px] w-[40px] p-0 flex items-center justify-center';
        break;
    }

    let variantClasses = '';
    switch (variant) {
      case 'primary':
        variantClasses =
          'bg-[#C85A32] text-white hover:bg-[#A84422] active:bg-[#923819] shadow-xs focus-visible:ring-2 focus-visible:ring-[#C85A32]/40';
        break;
      case 'secondary':
        variantClasses =
          'bg-white text-[#1A1A1A] border border-[#EFECE6] hover:bg-[#F7F5F0] hover:border-[#D8D2C6] active:bg-[#EFECE6] shadow-2xs focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20';
        break;
      case 'dark':
        variantClasses =
          'bg-[#1A1A1A] text-white hover:bg-[#2F2F2F] active:bg-[#0D0D0D] shadow-xs focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/40';
        break;
      case 'pine':
        variantClasses =
          'bg-[#2D4A3E] text-white hover:bg-[#22382F] active:bg-[#192A23] shadow-xs focus-visible:ring-2 focus-visible:ring-[#2D4A3E]/40';
        break;
      case 'outline':
        variantClasses =
          'bg-transparent text-[#C85A32] border border-[#C85A32] hover:bg-[#FDF0EB] active:bg-[#F8DFD4] focus-visible:ring-2 focus-visible:ring-[#C85A32]/30';
        break;
      case 'ghost':
        variantClasses =
          'bg-transparent text-[#666059] hover:text-[#1A1A1A] hover:bg-[#EFECE6]/60 active:bg-[#EFECE6] focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/10';
        break;
    }

    const roundedClass = pill ? 'rounded-full' : 'rounded-lg';
    const disabledClass = disabled || isLoading ? 'opacity-55 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 select-none outline-none transition-all duration-200 ease-out ${roundedClass} ${sizeClasses} ${variantClasses} ${disabledClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="inline-flex flex-shrink-0">{leftIcon}</span>}
            {children && <span className="truncate leading-none">{children}</span>}
            {rightIcon && <span className="inline-flex flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
