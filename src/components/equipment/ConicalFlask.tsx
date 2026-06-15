import { motion } from 'framer-motion';

interface ConicalFlaskProps {
  liquidColor?: string;
  liquidLevel?: number;
  showBubbles?: boolean;
  bubbleColor?: string;
  size?: number;
}

export const ConicalFlask: React.FC<ConicalFlaskProps> = ({
  liquidColor = '#10B981',
  liquidLevel = 55,
  showBubbles = false,
  bubbleColor = '#FFFFFF',
  size = 200
}) => {
  const flaskHeight = size;
  const flaskWidth = size * 0.8;
  const liquidHeight = (flaskHeight * 0.55) * (liquidLevel / 100);
  const liquidBottomY = flaskHeight * 0.9;
  const liquidTopY = liquidBottomY - liquidHeight;

  return (
    <svg width={flaskWidth * 1.1} height={flaskHeight * 1.05} viewBox={`0 0 ${flaskWidth * 1.1} ${flaskHeight * 1.05}`}>
      <defs>
        <linearGradient id="flaskGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(200, 220, 240, 0.3)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(200, 220, 240, 0.3)" />
        </linearGradient>
        <linearGradient id="flaskLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>
        <filter id="flaskGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${flaskWidth * 0.05}, ${flaskHeight * 0.02})`}>
        <ellipse
          cx={flaskWidth * 0.5}
          cy={flaskHeight * 0.95}
          rx={flaskWidth * 0.42}
          ry={flaskHeight * 0.06}
          fill="rgba(0, 0, 0, 0.12)"
        />

        <path
          d={`M ${flaskWidth * 0.35} ${flaskHeight * 0.1}
              L ${flaskWidth * 0.35} ${flaskHeight * 0.25}
              L ${flaskWidth * 0.08} ${flaskHeight * 0.85}
              Q ${flaskWidth * 0.5} ${flaskHeight * 0.95} ${flaskWidth * 0.92} ${flaskHeight * 0.85}
              L ${flaskWidth * 0.65} ${flaskHeight * 0.25}
              L ${flaskWidth * 0.65} ${flaskHeight * 0.1}
              Q ${flaskWidth * 0.65} ${flaskHeight * 0.05} ${flaskWidth * 0.5} ${flaskHeight * 0.05}
              Q ${flaskWidth * 0.35} ${flaskHeight * 0.05} ${flaskWidth * 0.35} ${flaskHeight * 0.1} Z`}
          fill="url(#flaskGlass)"
          stroke="#94A3B8"
          strokeWidth="2"
        />

        <ellipse
          cx={flaskWidth * 0.5}
          cy={flaskHeight * 0.08}
          rx={flaskWidth * 0.14}
          ry={flaskHeight * 0.03}
          fill="rgba(255, 255, 255, 0.6)"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        <motion.path
          initial={{ d: `M ${flaskWidth * 0.38} ${liquidTopY + 5}
                          Q ${flaskWidth * 0.5} ${liquidTopY} ${flaskWidth * 0.62} ${liquidTopY + 5}
                          L ${flaskWidth * 0.85} ${liquidBottomY - 10}
                          Q ${flaskWidth * 0.5} ${liquidBottomY} ${flaskWidth * 0.15} ${liquidBottomY - 10} Z` }}
          animate={{ d: [
            `M ${flaskWidth * 0.38} ${liquidTopY + 5}
              Q ${flaskWidth * 0.5} ${liquidTopY} ${flaskWidth * 0.62} ${liquidTopY + 5}
              L ${flaskWidth * 0.85} ${liquidBottomY - 10}
              Q ${flaskWidth * 0.5} ${liquidBottomY} ${flaskWidth * 0.15} ${liquidBottomY - 10} Z`,
            `M ${flaskWidth * 0.38} ${liquidTopY + 5}
              Q ${flaskWidth * 0.5} ${liquidTopY + 3} ${flaskWidth * 0.62} ${liquidTopY + 5}
              L ${flaskWidth * 0.85} ${liquidBottomY - 10}
              Q ${flaskWidth * 0.5} ${liquidBottomY} ${flaskWidth * 0.15} ${liquidBottomY - 10} Z`,
            `M ${flaskWidth * 0.38} ${liquidTopY + 5}
              Q ${flaskWidth * 0.5} ${liquidTopY} ${flaskWidth * 0.62} ${liquidTopY + 5}
              L ${flaskWidth * 0.85} ${liquidBottomY - 10}
              Q ${flaskWidth * 0.5} ${liquidBottomY} ${flaskWidth * 0.15} ${liquidBottomY - 10} Z`
          ] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          fill="url(#flaskLiquid)"
        />

        {showBubbles && (
          <g filter="url(#flaskGlow)">
            {[...Array(10)].map((_, i) => (
              <motion.circle
                key={i}
                cx={flaskWidth * (0.3 + Math.random() * 0.4)}
                r={2 + Math.random() * 3}
                fill={bubbleColor}
                initial={{ y: liquidBottomY - 20, opacity: 0.8 }}
                animate={{
                  y: liquidTopY - 10,
                  opacity: [0.8, 0.6, 0],
                  scale: [1, 1.2, 0.5]
                }}
                transition={{
                  duration: 1.8 + Math.random() * 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </g>
        )}

        <path
          d={`M ${flaskWidth * 0.4} ${flaskHeight * 0.3}
              L ${flaskWidth * 0.45} ${flaskHeight * 0.55}`}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
