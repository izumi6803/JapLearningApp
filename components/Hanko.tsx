export function Hanko({
  label = "合格",
  size = 44,
  filled = false,
  animate = false,
  className = "",
}: {
  label?: string;
  size?: number;
  filled?: boolean;
  animate?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`hanko ${filled ? "hanko-fill" : ""} ${
        animate ? "animate-stamp" : ""
      } ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {label}
    </span>
  );
}
