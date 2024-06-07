import * as React from 'react';

import { Input } from './input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

// eslint-disable-next-line prettier/prettier
export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      suffix={
        showPassword ? (
          <EyeIcon onClick={() => setShowPassword(false)} className="cursor-pointer" />
        ) : (
          <EyeOffIcon onClick={() => setShowPassword(true)} className="cursor-pointer" />
        )
      }
      className={className}
      {...props}
      ref={ref}
    />
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
