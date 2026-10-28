type P = { size?: number; className?: string; strokeWidth?: number };

/** ↗ стрелка-диагональ (карточки, ссылки). */
export function ArrowUpRight({ size = 22, className = "", strokeWidth = 1.2 }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block ${className}`}
      aria-hidden
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

/** ↗ стрелка в квадратных концах (кейсы, услуги). */
export function ArrowSquare({ size = 26, className = "", strokeWidth = 1.4 }: P) {
  return (
    <svg viewBox="0 0 26 26" width={size} height={size} fill="none" className={`block ${className}`} aria-hidden>
      <path d="M8 18L18 8M18 8H10.5M18 8V15.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" />
    </svg>
  );
}

export function Chevron({ size = 10, className = "" }: P) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}

export function Globe({ size = 22 }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9M12 3c-2.6 2.6-3.8 5.6-3.8 9s1.2 6.4 3.8 9" />
    </svg>
  );
}

export function Paperclip({ size = 18 }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block flex-none"
      aria-hidden
    >
      <path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9" />
    </svg>
  );
}

export function Doc({ size = 20 }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block flex-none"
      aria-hidden
    >
      <rect x="5" y="3" width="14" height="18" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function Close({ size = 20 }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronSide({ dir, size = 18 }: P & { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
