export default function Button({
  className,
  onClick,
  disabled,
  style,
  children,
}: {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
