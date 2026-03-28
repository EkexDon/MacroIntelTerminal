interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export default function Sparkline({ 
  data, 
  color = "var(--primary-color)", 
  width = 100, 
  height = 30,
  strokeWidth = 2,
  className = "" 
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  // Create a subtle gradient fill area beneath the line
  const fillPathData = `${pathData} L ${width},${height} L 0,${height} Z`;

  return (
    <svg 
      width={width} 
      height={height} 
      className={`overflow-visible ${className}`} 
      style={{ color }}
    >
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path 
        d={fillPathData} 
        fill={`url(#gradient-${color})`} 
        className="transition-all duration-1000"
      />
      <path 
        d={pathData} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="transition-all duration-1000 drop-shadow-[0_0_4px_currentColor]" 
      />
    </svg>
  );
}
