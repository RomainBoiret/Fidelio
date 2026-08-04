import { Decorative } from '@/components/brand/decorative';
import { useTheme } from '@/hooks/use-theme';
import Svg, { Rect, Circle } from 'react-native-svg';

type Props = {
  size?: number;
};

/** Empty wall — soft frame on a pedestal, waiting. */
export function EmptyGallery({ size = 160 }: Props) {
  const colors = useTheme();
  const w = size;
  const h = size * 0.72;

  return (
    <Decorative style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox="0 0 160 116">
        <Rect x="40" y="98" width="80" height="6" rx="3" fill={colors.stone} opacity={0.8} />
        <Rect x="52" y="90" width="56" height="8" rx="4" fill={colors.surfaceStrong} />
        <Rect
          x="30"
          y="14"
          width="100"
          height="70"
          rx="14"
          fill={colors.surface}
        />
        <Rect
          x="42"
          y="26"
          width="76"
          height="46"
          rx="10"
          fill={colors.cream}
          stroke={colors.stone}
          strokeWidth={1}
        />
        <Circle cx="80" cy="49" r="6" fill={colors.accent} opacity={0.35} />
      </Svg>
    </Decorative>
  );
}
