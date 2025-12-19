
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`card-surface ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
