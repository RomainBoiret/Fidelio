import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Decorative } from '@/components/brand/decorative';

type Props = {
  size?: number;
  color?: string;
};

/** Empty-wallet scene: wallet + peeking ticket + scan frame. */
export function EmptyWalletArt({ size = 160, color = '#2F5BFF' }: Props) {
  return (
    <Decorative>
      <Svg width={size} height={size * 0.78} viewBox="0 0 160 124">
        <Rect x="18" y="42" width="124" height="68" rx="16" fill={color} opacity={0.12} />
        <Rect x="24" y="48" width="112" height="56" rx="14" fill={color} opacity={0.18} />
        <Path
          d="M28 58 H132 C136 58 138 60 138 64 V96 C138 100 136 102 132 102 H28 C24 102 22 100 22 96 V64 C22 60 24 58 28 58 Z"
          fill={color}
          opacity={0.9}
        />
        <Rect x="40" y="28" width="80" height="42" rx="10" fill="#FFFFFF" />
        <Rect x="40" y="28" width="80" height="8" rx="4" fill={color} opacity={0.85} />
        <Circle cx="48" cy="56" r="4" fill="#EEF1F8" />
        <Circle cx="112" cy="56" r="4" fill="#EEF1F8" />
        <Rect x="54" y="48" width="3" height="14" rx="1" fill={color} />
        <Rect x="60" y="48" width="2" height="14" rx="1" fill={color} />
        <Rect x="65" y="48" width="4" height="14" rx="1" fill={color} />
        <Rect x="72" y="48" width="2" height="14" rx="1" fill={color} />
        <Rect x="77" y="48" width="3" height="14" rx="1" fill={color} />
        <Rect x="84" y="48" width="2" height="14" rx="1" fill={color} />
        <Rect x="90" y="48" width="4" height="14" rx="1" fill={color} />
        <Rect x="98" y="48" width="2" height="14" rx="1" fill={color} />
        <Path
          d="M118 72 H146 V100 H118"
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          opacity={0.55}
        />
        <Path
          d="M42 72 H14 V100 H42"
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          opacity={0.55}
        />
      </Svg>
    </Decorative>
  );
}
