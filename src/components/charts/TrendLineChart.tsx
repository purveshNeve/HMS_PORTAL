export function TrendLineChart({
  data,
  labels,
  height = 120,
}: {
  data: number[];
  labels: string[];
  height?: number;
}) {
  const width = 480;
  const padding = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (value - min) / range) * (height - padding * 2);
    return { x, y, value };
  });

  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Gridlines */}
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={padding}
          x2={width - padding}
          y1={padding + t * (height - padding * 2)}
          y2={padding + t * (height - padding * 2)}
          stroke="#E2E4E8"
          strokeWidth={1}
        />
      ))}

      <path d={path} fill="none" stroke="#3A66B8" strokeWidth={1.75} />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#3A66B8" />
      ))}

      {labels.map((label, i) => {
        const x = padding + (i / (labels.length - 1)) * (width - padding * 2);
        return (
          <text key={label} x={x} y={height - 4} fontSize="9" textAnchor="middle" fill="#8A93A1">
            {label}
          </text>
        );
      })}
    </svg>
  );
}
