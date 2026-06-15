import { motion } from 'framer-motion';

interface TestTubeProps {
  liquidColor?: string;
  liquidLevel?: number;
  showBubbles?: boolean;
  bubbleColor?: string;
  size?: number;
  tilted?: boolean;
}

export const TestTube: React.FC<TestTubeProps> = ({
  liquidColor = '#7C3AED',
  liquidLevel = 50,
  showBubbles = false,
  bubbleColor = '#FFFFFF',
  size = 200,
  tilted = false
}) => {
  const tubeHeight = size;
  const tubeWidth = size * 0.35;
  const liquidHeight = (tubeHeight * 0.7) * (liquidLevel / 100);
  const liquidY = tubeHeight * 0.92 - liquidHeight;

  return (
    <svg
      width={tubeWidth * 1.2}
      height={tubeHeight * 1.1}
      viewBox={`0 0 ${tubeWidth * 1.2} ${tubeHeight * 1.1}`}
      style={{ transform: tilted ? 'rotate(-15deg)' : 'none', transformOrigin: 'center bottom' }}
    >
      <defs>
        <linearGradient id="tubeGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(200, 220, 240, 0.3)" />
          <stop offset="40%" stopColor="rgba(255, 255, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(200, 220, 240, 0.3)" />
        </linearGradient>
        <linearGradient id="tubeLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.85" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>
        <filter id="tubeGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${tubeWidth * 0.1}, ${tubeHeight * 0.05})`}>
        <path
          d={`M 0 0 
              L 0 ${tubeHeight * 0.85}
              Q 0 ${tubeHeight * 0.92} ${tubeWidth * 0.5} ${tubeHeight * 0.92}
              Q ${tubeWidth} ${tubeHeight * 0.92} ${tubeWidth} ${tubeHeight * 0.85}
              L ${tubeWidth} 0 Z`}
          fill="url(#tubeGlass)"
          stroke="#94A3B8"
          strokeWidth="2"
        />

        <path
          d={`M -4 0 L ${tubeWidth + 4} 0`}
          stroke="#64748B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <motion.path
          initial={{ d: `M ${tubeWidth * 0.05} ${liquidY + 10}
                          Q ${tubeWidth * 0.5} ${liquidY + 5} ${tubeWidth * 0.95} ${liquidY + 10}
                          L ${tubeWidth * 0.95} ${tubeHeight * 0.85}
                          Q ${tubeWidth * 0.5} ${tubeHeight * 0.9} ${tubeWidth * 0.05} ${tubeHeight * 0.85} Z` }}
          animate={{ d: [
            `M ${tubeWidth * 0.05} ${liquidY + 10}
              Q ${tubeWidth * 0.5} ${liquidY + 5} ${tubeWidth * 0.95} ${liquidY + 10}
              L ${tubeWidth * 0.95} ${tubeHeight * 0.85}
              Q ${tubeWidth * 0.5} ${tubeHeight * 0.9} ${tubeWidth * 0.05} ${tubeHeight * 0.85} Z`,
            `M ${tubeWidth * 0.05} ${liquidY + 10}
              Q ${tubeWidth * 0.5} ${liquidY + 8} ${tubeWidth * 0.95} ${liquidY + 10}
              L ${tubeWidth * 0.95} ${tubeHeight * 0.85}
              Q ${tubeWidth * 0.5} ${tubeHeight * 0.9} ${tubeWidth * 0.05} ${tubeHeight * 0.85} Z`,
            `M ${tubeWidth * 0.05} ${liquidY + 10}
              Q ${tubeWidth * 0.5} ${liquidY + 5} ${tubeWidth * 0.95} ${liquidY + 10}
              L ${tubeWidth * 0.95} ${tubeHeight * 0.85}
              Q ${tubeWidth * 0.5} ${tubeHeight * 0.9} ${tubeWidth * 0.05} ${tubeHeight * 0.85} Z`
          ] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          fill="url(#tubeLiquid)"
        />

        {showBubbles && (
          <g filter="url(#tubeGlow)">
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={i}
                cx={tubeWidth * (0.3 + Math.random() * 0.4)}
                r={2 + Math.random() * 3}
                fill={bubbleColor}
                initial={{ y: tubeHeight * 0.75, opacity: 0.8 }}
                animate={{
                  y: liquidY - 5,
                  opacity: [0.8, 0.5, 0],
                  scale: [1, 1.3, 0.4]
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.8,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeOut"
                }}
              />
            ))}
          </g>
        )}

        <path
          d={`M ${tubeWidth * 0.12} ${tubeHeight * 0.1} 
              L ${tubeWidth * 0.18} ${tubeHeight * 0.3}`}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
