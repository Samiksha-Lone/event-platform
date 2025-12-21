
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-neutral-900 disabled:bg-indigo-400',
    secondary: 'bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600/30 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-neutral-900 disabled:opacity-50',
    danger: 'bg-red-400 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-neutral-900 disabled:bg-red-400',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-base',
    md: 'px-6 py-3.5 text-lg',
    lg: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
