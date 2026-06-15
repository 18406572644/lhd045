import { motion } from 'framer-motion';

interface AlcoholLampProps {
  isHeating?: boolean;
  flameIntensity?: number;
  size?: number;
}

export const AlcoholLamp: React.FC<AlcoholLampProps> = ({
  isHeating = false,
  flameIntensity = 0.8,
  size = 120
}) => {
  const lampHeight = size;
  const lampWidth = size * 0.8;
  const flameHeight = lampHeight * 0.6 * flameIntensity;

  return (
    <svg width={lampWidth * 1.2} height={lampHeight + flameHeight + 20} viewBox={`0 0 ${lampWidth * 1.2} ${lampHeight + flameHeight + 20}`}>
      <defs>
        <linearGradient id="lampGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(180, 200, 220, 0.4)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
          <stop offset="100%" stopColor="rgba(180, 200, 220, 0.4)" />
        </linearGradient>
        <linearGradient id="alcohol" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(200, 220, 255, 0.7)" />
          <stop offset="100%" stopColor="rgba(150, 180, 230, 0.85)" />
        </linearGradient>
        <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F97316" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
        <filter id="flameGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${lampWidth * 0.1}, ${flameHeight + 10})`}>
        <ellipse
          cx={lampWidth * 0.5}
          cy={lampHeight * 0.95}
          rx={lampWidth * 0.45}
          ry={lampHeight * 0.08}
          fill="rgba(0, 0, 0, 0.15)"
        />

        <path
          d={`M ${lampWidth * 0.1} ${lampHeight * 0.35}
              L ${lampWidth * 0.15} ${lampHeight * 0.9}
              Q ${lampWidth * 0.5} ${lampHeight * 1.0} ${lampWidth * 0.85} ${lampHeight * 0.9}
              L ${lampWidth * 0.9} ${lampHeight * 0.35}
              Q ${lampWidth * 0.85} ${lampHeight * 0.25} ${lampWidth * 0.65} ${lampHeight * 0.25}
              L ${lampWidth * 0.35} ${lampHeight * 0.25}
              Q ${lampWidth * 0.15} ${lampHeight * 0.25} ${lampWidth * 0.1} ${lampHeight * 0.35} Z`}
          fill="url(#lampGlass)"
          stroke="#94A3B8"
          strokeWidth="2"
        />

        <path
          d={`M ${lampWidth * 0.18} ${lampHeight * 0.55}
              L ${lampWidth * 0.22} ${lampHeight * 0.85}
              Q ${lampWidth * 0.5} ${lampHeight * 0.92} ${lampWidth * 0.78} ${lampHeight * 0.85}
              L ${lampWidth * 0.82} ${lampHeight * 0.55}
              Q ${lampWidth * 0.5} ${lampHeight * 0.6} ${lampWidth * 0.18} ${lampHeight * 0.55} Z`}
          fill="url(#alcohol)"
        />

        <rect
          x={lampWidth * 0.42}
          y={lampHeight * 0.05}
          width={lampWidth * 0.16}
          height={lampHeight * 0.25}
          rx="2"
          fill="#D4A574"
          stroke="#92400E"
          strokeWidth="1"
        />

        <rect
          x={lampWidth * 0.45}
          y={lampHeight * -0.05}
          width={lampWidth * 0.1}
          height={lampHeight * 0.12}
          rx="1"
          fill="#78716C"
        />

        <path
          d={`M ${lampWidth * 0.25} ${lampHeight * 0.4}
              L ${lampWidth * 0.3} ${lampHeight * 0.7}`}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {isHeating && (
        <g filter="url(#flameGlow)">
          <motion.path
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.9, 1, 0.85, 1],
              scale: [1, 1.05, 0.98, 1.02],
              d: [
                `M ${lampWidth * 0.5} ${flameHeight}
                 Q ${lampWidth * 0.35} ${flameHeight * 0.6} ${lampWidth * 0.45} ${flameHeight * 0.2}
                 Q ${lampWidth * 0.5} ${flameHeight * -0.1} ${lampWidth * 0.55} ${flameHeight * 0.2}
                 Q ${lampWidth * 0.65} ${flameHeight * 0.6} ${lampWidth * 0.5} ${flameHeight} Z`,
                `M ${lampWidth * 0.5} ${flameHeight}
                 Q ${lampWidth * 0.32} ${flameHeight * 0.55} ${lampWidth * 0.42} ${flameHeight * 0.15}
                 Q ${lampWidth * 0.5} ${flameHeight * -0.15} ${lampWidth * 0.58} ${flameHeight * 0.15}
                 Q ${lampWidth * 0.68} ${flameHeight * 0.55} ${lampWidth * 0.5} ${flameHeight} Z`,
                `M ${lampWidth * 0.5} ${flameHeight}
                 Q ${lampWidth * 0.38} ${flameHeight * 0.62} ${lampWidth * 0.48} ${flameHeight * 0.18}
                 Q ${lampWidth * 0.5} ${flameHeight * -0.08} ${lampWidth * 0.52} ${flameHeight * 0.18}
                 Q ${lampWidth * 0.62} ${flameHeight * 0.62} ${lampWidth * 0.5} ${flameHeight} Z`
              ]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            fill="url(#flameOuter)"
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.9, 1, 0.8, 1],
              scale: [1, 1.08, 0.95, 1.03],
              d: [
                `M ${lampWidth * 0.5} ${flameHeight * 0.85}
                 Q ${lampWidth * 0.4} ${flameHeight * 0.5} ${lampWidth * 0.47} ${flameHeight * 0.25}
                 Q ${lampWidth * 0.5} ${flameHeight * 0.05} ${lampWidth * 0.53} ${flameHeight * 0.25}
                 Q ${lampWidth * 0.6} ${flameHeight * 0.5} ${lampWidth * 0.5} ${flameHeight * 0.85} Z`,
                `M ${lampWidth * 0.5} ${flameHeight * 0.85}
                 Q ${lampWidth * 0.38} ${flameHeight * 0.48} ${lampWidth * 0.45} ${flameHeight * 0.22}
                 Q ${lampWidth * 0.5} ${flameHeight * 0.02} ${lampWidth * 0.55} ${flameHeight * 0.22}
                 Q ${lampWidth * 0.62} ${flameHeight * 0.48} ${lampWidth * 0.5} ${flameHeight * 0.85} Z`,
                `M ${lampWidth * 0.5} ${flameHeight * 0.85}
                 Q ${lampWidth * 0.42} ${flameHeight * 0.52} ${lampWidth * 0.48} ${flameHeight * 0.26}
                 Q ${lampWidth * 0.5} ${flameHeight * 0.08} ${lampWidth * 0.52} ${flameHeight * 0.26}
                 Q ${lampWidth * 0.58} ${flameHeight * 0.52} ${lampWidth * 0.5} ${flameHeight * 0.85} Z`
              ]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
            fill="url(#flameInner)"
          />
          {[...Array(12)].map((_, i) => (
            <motion.circle
              key={i}
              cx={lampWidth * (0.4 + Math.random() * 0.2)}
              r={1 + Math.random() * 2}
              fill={i % 2 === 0 ? '#FBBF24' : '#F97316'}
              initial={{ y: flameHeight * 0.8, opacity: 0.8 }}
              animate={{
                y: flameHeight * (-0.2 - Math.random() * 0.3),
                opacity: [0.8, 0.5, 0],
                scale: [1, 0.8, 0.3]
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut"
              }}
            />
          ))}
        </g>
      )}
    </svg>
  );
};
