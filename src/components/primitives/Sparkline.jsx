/**
 * Lightweight structural sparkline — polyline + baseline. No chart library.
 */
export default function Sparkline({
  values = [],
  width = 88,
  height = 28,
  color = "#6B3FA0",
  fill = "rgba(107, 63, 160, 0.12)",
}) {
  const nums = (values || []).map(Number).filter((n) => !Number.isNaN(n));
  if (nums.length < 2) {
    return (
      <svg width={width} height={height} aria-hidden="true">
        <line x1="0" y1={height - 2} x2={width} y2={height - 2} stroke="#D4C4A8" strokeWidth="1" />
      </svg>
    );
  }
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min || 1;
  const step = width / (nums.length - 1);
  const pts = nums.map((v, i) => {
    const x = i * step;
    const y = height - 2 - ((v - min) / span) * (height - 6);
    return [x, y];
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polygon points={area} fill={fill} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
