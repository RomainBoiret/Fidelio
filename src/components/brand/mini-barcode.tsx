import Svg, { Rect } from 'react-native-svg';

import { Decorative } from '@/components/brand/decorative';

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

/** Compact barcode motif — brand signature, not a real code. */
export function MiniBarcode({
  width = 88,
  height = 22,
  color = '#12141C',
}: Props) {
  const bars = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 1, 2, 3, 1, 2];
  let x = 0;

  return (
    <Decorative>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {bars.map((w, i) => {
          const barX = x;
          x += w + 1.4;
          return (
            <Rect
              key={`${i}-${barX}`}
              x={barX}
              y={0}
              width={w}
              height={height}
              rx={0.5}
              fill={i % 2 === 0 ? color : 'transparent'}
            />
          );
        })}
      </Svg>
    </Decorative>
  );
}
