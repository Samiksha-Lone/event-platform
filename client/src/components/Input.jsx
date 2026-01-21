import { useState, forwardRef } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  error = '',
  icon = null,
  className = '',
  showLabel = true,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';
  const isPasswordType = type === 'password';
  const displayType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      
      {showLabel && label && (
        <label className="block mb-1.5 text-xs font-bold text-neutral-700 dark:text-gray-300 uppercase tracking-widest transition-all duration-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute transition-colors duration-500 transform -translate-y-1/2 left-4 top-1/2 text-neutral-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        <Component
          ref={ref}
          type={type === 'textarea' ? undefined : displayType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 text-sm border-2 rounded-xl transition-all duration-300 outline-none
            ${error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }
            bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400
            ${icon ? 'pl-11' : ''} ${isPasswordType ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute p-2 transition-colors transform -translate-y-1/2 right-4 top-1/2 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-200"
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm font-bold text-red-700 transition-colors duration-500 dark:text-red-400">{error}</p>}
    </div>
  );
});

export default Input;
