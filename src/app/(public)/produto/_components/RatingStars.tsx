export function RatingStars({
  value = 0,
  size = 16,
}: {
  value?: number;
  size?: number;
}) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const total = 5;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      aria-label={`Nota ${value} de 5`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < full;
        const half = !filled && i === full && hasHalf;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={filled || half ? "text-amber-500" : "text-slate-300"}
            aria-hidden
          >
            <defs>
              <linearGradient id={`half-${i}`} x1="0" x2="1">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={filled ? "currentColor" : half ? `url(#half-${i})` : "none"}
              stroke="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        );
      })}
      <span className="ml-1 text-sm text-slate-700">{value.toFixed(1)}</span>
    </div>
  );
}
