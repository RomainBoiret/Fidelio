import Svg, { Path, Rect } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  active?: boolean;
};

/** Scan glyph: barcode inside a viewfinder — no wrapper View. */
export function ScanFrameIcon({ size = 26, color = '#FFFFFF', active = false }: Props) {
  const stroke = active ? 2.2 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      <Path
        d="M4 10 V6 H10"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M18 6 H24 V10"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M24 18 V22 H18"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M10 22 H4 V18"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <Rect x="8" y="10" width="2" height="8" rx="0.5" fill={color} />
      <Rect x="12" y="10" width="1.4" height="8" rx="0.5" fill={color} />
      <Rect x="15" y="10" width="2.4" height="8" rx="0.5" fill={color} />
      <Rect x="19" y="10" width="1.4" height="8" rx="0.5" fill={color} />
    </Svg>
  );
}
