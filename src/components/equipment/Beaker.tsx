import { motion } from 'framer-motion';

interface BeakerProps {
  liquidColor?: string;
  liquidLevel?: number;
  showBubbles?: boolean;
  bubbleColor?: string;
  size?: number;
}

export const Beaker: React.FC<BeakerProps> = ({
  liquidColor = '#60A5FA',
  liquidLevel = 60,
  showBubbles = false,
  bubbleColor = '#FFFFFF',
  size = 200
}) => {
  const beakerHeight = size;
  const beakerWidth = size * 0.7;
  const liquidHeight = (beakerHeight * 0.75) * (liquidLevel / 100);
  const liquidY = beakerHeight * 0.9 - liquidHeight;

  return (
    <svg width={beakerWidth} height={beakerHeight} viewBox={`0 0 ${beakerWidth} ${beakerHeight}`}>
      <defs>
        <linearGradient id="beakerGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(200, 220, 240, 0.3)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(200, 220, 240, 0.3)" />
        </linearGradient>
        <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <path
        d={`M ${beakerWidth * 0.1} ${beakerHeight * 0.9} 
            L ${beakerWidth * 0.15} ${beakerHeight * 0.1} 
            L ${beakerWidth * 0.85} ${beakerHeight * 0.1} 
            L ${beakerWidth * 0.9} ${beakerHeight * 0.9} Z`}
        fill="url(#beakerGlass)"
        stroke="#94A3B8"
        strokeWidth="2"
      />
      
      <path
        d={`M ${beakerWidth * 0.1} ${beakerHeight * 0.9} 
            L ${beakerWidth * 0.9} ${beakerHeight * 0.9}`}
        stroke="#64748B"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d={`M ${beakerWidth * 0.05} ${beakerHeight * 0.1} 
            L ${beakerWidth * 0.15} ${beakerHeight * 0.05}
            L ${beakerWidth * 0.85} ${beakerHeight * 0.05}
            L ${beakerWidth * 0.95} ${beakerHeight * 0.1}`}
        fill="rgba(255, 255, 255, 0.6)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />

      <motion.path
        initial={{ d: `M ${beakerWidth * 0.12} ${liquidY + 20} 
                      Q ${beakerWidth * 0.5} ${liquidY + 15} ${beakerWidth * 0.88} ${liquidY + 20}
                      L ${beakerWidth * 0.88} ${beakerHeight * 0.88}
                      L ${beakerWidth * 0.12} ${beakerHeight * 0.88} Z` }}
        animate={{ d: [
          `M ${beakerWidth * 0.12} ${liquidY + 20} 
            Q ${beakerWidth * 0.5} ${liquidY + 15} ${beakerWidth * 0.88} ${liquidY + 20}
            L ${beakerWidth * 0.88} ${beakerHeight * 0.88}
            L ${beakerWidth * 0.12} ${beakerHeight * 0.88} Z`,
          `M ${beakerWidth * 0.12} ${liquidY + 20} 
            Q ${beakerWidth * 0.5} ${liquidY + 18} ${beakerWidth * 0.88} ${liquidY + 20}
            L ${beakerWidth * 0.88} ${beakerHeight * 0.88}
            L ${beakerWidth * 0.12} ${beakerHeight * 0.88} Z`,
          `M ${beakerWidth * 0.12} ${liquidY + 20} 
            Q ${beakerWidth * 0.5} ${liquidY + 15} ${beakerWidth * 0.88} ${liquidY + 20}
            L ${beakerWidth * 0.88} ${beakerHeight * 0.88}
            L ${beakerWidth * 0.12} ${beakerHeight * 0.88} Z`
        ] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        fill="url(#liquidGradient)"
      />

      {[beakerHeight * 0.4, beakerHeight * 0.55, beakerHeight * 0.7].map((y, i) => (
        <line
          key={i}
          x1={beakerWidth * 0.12}
          y1={y}
          x2={beakerWidth * 0.2}
          y2={y}
          stroke="#CBD5E1"
          strokeWidth="1"
        />
      ))}

      {showBubbles && (
        <g filter="url(#glow)">
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={i}
              cx={beakerWidth * (0.3 + Math.random() * 0.4)}
              r={3 + Math.random() * 4}
              fill={bubbleColor}
              initial={{ y: beakerHeight * 0.85, opacity: 0.8 }}
              animate={{
                y: liquidY - 10,
                opacity: [0.8, 0.6, 0],
                scale: [1, 1.2, 0.5]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </g>
      )}

      <path
        d={`M ${beakerWidth * 0.18} ${beakerHeight * 0.15} 
            L ${beakerWidth * 0.22} ${beakerHeight * 0.25}`}
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
