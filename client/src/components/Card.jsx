
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
