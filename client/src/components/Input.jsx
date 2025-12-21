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
  showLabel = true,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';
  const isPasswordType = type === 'password';
  const displayType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {/* Before */}
      {/* {label && (
        <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
          {label}
        </label>
      )} */}

      {showLabel && label && (
        <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute transition-colors duration-500 transform -translate-y-1/2 left-4 top-1/2 text-neutral-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        <Component
          type={type === 'textarea' ? undefined : displayType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-4 text-lg bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${icon ? 'pl-14' : ''} ${isPasswordType ? 'pr-14' : ''} ${error ? 'border-red-500 dark:border-red-600/50 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute p-2 transition-colors transform -translate-y-1/2 right-4 top-1/2 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-200"
          >
            {showPassword ? <FiEye size={24} /> : <FiEyeOff size={24} />}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-base font-bold text-red-700 transition-colors duration-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
