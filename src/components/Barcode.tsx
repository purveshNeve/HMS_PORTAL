"use client";

import { useMemo } from "react";

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
}

export default function Barcode({ value, width = 88, height = 28 }: BarcodeProps) {
  const bars = useMemo(() => {
    const barCount = 42;
    const barW = width / barCount;
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed += value.charCodeAt(i) * (i + 1);
    }

    const result: { x: number; w: number; dark: boolean }[] = [];
    let x = 0;
    for (let i = 0; i < barCount; i++) {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      const isDark = (seed >>> 0) % 3 !== 0;
      result.push({ x, w: barW - 0.5, dark: isDark });
      x += barW;
    }
    return result;
  }, [value, width]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      {bars.map((bar, i) =>
        bar.dark ? (
          <rect
            key={i}
            x={bar.x.toFixed(2)}
            y={0}
            width={bar.w.toFixed(2)}
            height={height}
            fill="#111827"
          />
        ) : null
      )}
    </svg>
  );
}
