// hooks/useScale.ts
import { useWindowDimensions } from 'react-native';

const LANDSCAPE_BASE_WIDTH = 914.3; 
const LANDSCAPE_BASE_HEIGHT = 387.4;

const PORTRAIT_BASE_WIDTH = 387.4;
const PORTRAIT_BASE_HEIGHT = 914.3;

export function useScale() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const BASE_WIDTH = isLandscape ? LANDSCAPE_BASE_WIDTH : PORTRAIT_BASE_WIDTH;
  const BASE_HEIGHT = isLandscape ? LANDSCAPE_BASE_HEIGHT : PORTRAIT_BASE_HEIGHT;

  const scaleX = width / BASE_WIDTH;
  const scaleY = height / BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const scaleSize = (size: number) => size * scale;

  return {
    width,
    height,
    isLandscape,
    scaleX,
    scaleY,
    scale,
    scaleSize,
  };
}
