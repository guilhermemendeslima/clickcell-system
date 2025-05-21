import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, className = '', ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={`input ${error ? 'border-error-dark' : ''} ${className}`}
          {...props}
        />
        {helperText && (
          <p className={`mt-1 text-xs ${error ? 'text-error-light' : 'text-gray-400'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

export { Input }