// utils/normalize.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // base on iPhone 11

export function normalize(size: number): number {
  const newSize = size * scale;
return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
