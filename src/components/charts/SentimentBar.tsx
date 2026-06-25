export function SentimentBar({
  positive,
  neutral,
  negative,
}: {
  positive: number;
  neutral: number;
  negative: number;
}) {
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden border border-border">
        <div className="bg-success-500" style={{ width: `${positive}%` }} />
        <div className="bg-border-strong" style={{ width: `${neutral}%` }} />
        <div className="bg-danger-500" style={{ width: `${negative}%` }} />
      </div>
      <div className="flex items-center gap-4 mt-2.5 text-xs">
        <span className="flex items-center gap-1.5 text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-success-500" /> Positive {positive}%
        </span>
        <span className="flex items-center gap-1.5 text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-border-strong" /> Neutral {neutral}%
        </span>
        <span className="flex items-center gap-1.5 text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-danger-500" /> Negative {negative}%
        </span>
      </div>
    </div>
  );
}
