import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  error = '',
  icon = null,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';
  const isPasswordType = type === 'password';
  const displayType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-3 text-lg font-bold text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute transform -translate-y-1/2 left-5 top-1/2 text-neutral-500 dark:text-neutral-400">
            {icon}
          </div>
        )}
        <Component
          type={type === 'textarea' ? undefined : displayType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-4 text-lg border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all duration-200 ${icon ? 'pl-14' : ''} ${isPasswordType ? 'pr-14' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute p-2 transition-colors transform -translate-y-1/2 right-5 top-1/2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            {showPassword ? <FiEye size={24} /> : <FiEyeOff size={24} />}
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-base font-bold text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
}
