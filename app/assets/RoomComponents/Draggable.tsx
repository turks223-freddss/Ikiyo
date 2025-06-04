import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  PanResponder,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';

interface DraggableProps {
  imageSource: ImageSourcePropType;
  currentPosition: { x: number; y: number };
  cellSize: { width: number; height: number };
  gridSize: { width: number; height: number };
  itemDimensions: { width: number; height: number };
  gridDimensions: { width: number; height: number };
  state: string;
  onDrop: (position: { x: number; y: number }) => void;
  occupiedGridCells: { col: number; row: number }[];
  allowOverlap: boolean;
  isDeleteMode?: boolean;
  onSelect?: () => void;
}

const Draggable: React.FC<DraggableProps> = ({
  imageSource,
  currentPosition,
  cellSize,
  gridSize,
  itemDimensions,
  gridDimensions,
  state,
  onDrop,
  occupiedGridCells,
  allowOverlap,
  isDeleteMode,
  onSelect,
}) => {
  const position = useRef(new Animated.ValueXY(currentPosition)).current;
  const [draggingPos, setDraggingPos] = useState<{ x: number; y: number } | null>(null);

  const offsetY = state === 'floor' ? gridDimensions.height * 0.6 : 0;

  useEffect(() => {
    position.setValue(currentPosition);
  }, [currentPosition]);

  const isGridCellOccupied = (startCol: number, startRow: number): boolean => {
    if (allowOverlap) return false;
    for (let dx = 0; dx < itemDimensions.width; dx++) {
      for (let dy = 0; dy < itemDimensions.height; dy++) {
        const col = startCol + dx;
        const row = startRow + dy;
        if (occupiedGridCells.some(cell => cell.col === col && cell.row === row)) {
          return true;
        }
      }
    }
    return false;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({ x: currentPosition.x, y: currentPosition.y });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gesture) => {
        const moveX = currentPosition.x + gesture.dx;
        const moveY = currentPosition.y + gesture.dy;

        const col = Math.round(moveX / cellSize.width);
        const row = Math.round((moveY - offsetY) / cellSize.height);

        const maxCol = Math.floor(
          (gridDimensions.width - itemDimensions.width * cellSize.width) / cellSize.width
        );
        const maxRow = Math.floor(
          (gridDimensions.height - offsetY - itemDimensions.height * cellSize.height) /
            cellSize.height
        );

        const clampedCol = Math.min(Math.max(0, col), maxCol);
        const clampedRow = Math.min(Math.max(0, row), maxRow);

        const snapX = clampedCol * cellSize.width;
        const snapY = clampedRow * cellSize.height + offsetY;

        if (!isGridCellOccupied(clampedCol, clampedRow)) {
          setDraggingPos({ x: snapX, y: snapY });
        } else {
          setDraggingPos(null);
        }

        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        position.flattenOffset();

        const moveX = currentPosition.x + gesture.dx;
        const moveY = currentPosition.y + gesture.dy;

        const col = Math.round(moveX / cellSize.width);
        const row = Math.round((moveY - offsetY) / cellSize.height);

        const maxCol = Math.floor(
          (gridDimensions.width - itemDimensions.width * cellSize.width) / cellSize.width
        );
        const maxRow = Math.floor(
          (gridDimensions.height - offsetY - itemDimensions.height * cellSize.height) /
            cellSize.height
        );

        const clampedCol = Math.min(Math.max(0, col), maxCol);
        const clampedRow = Math.min(Math.max(0, row), maxRow);

        const snapX = clampedCol * cellSize.width;
        const snapY = clampedRow * cellSize.height + offsetY;

        if (isGridCellOccupied(clampedCol, clampedRow)) {

          Animated.spring(position, {
            toValue: { x: currentPosition.x, y: currentPosition.y },
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(position, {
            toValue: { x: snapX, y: snapY },
            useNativeDriver: true,
          }).start();
          onDrop({ x: snapX, y: snapY });
        }
      },
    })
  ).current;

  return (
  <>
    {draggingPos && (
      <View
        pointerEvents="none"
        style={[
          styles.snapHighlight,
          {
            width: cellSize.width * itemDimensions.width,
            height: cellSize.height * itemDimensions.height,
            left: draggingPos.x,
            top: draggingPos.y,
            position: 'absolute',
          },
        ]}
      />
    )}
    {isDeleteMode ? (
      <Animated.View style={[position.getLayout(), styles.draggable]}>
        <Pressable
          onPress={() => {
            if (isDeleteMode && onSelect) onSelect();
          }}
          style={[
            {
              width: cellSize.width * itemDimensions.width,
              height: cellSize.height * itemDimensions.height,
            }
          ]}
        >
          <Image
            source={imageSource}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Pressable>
      </Animated.View>
    ) : (
      <Animated.View {...panResponder.panHandlers} style={[position.getLayout(), styles.draggable]}>
        <Image
          source={imageSource}
          style={{
            width: cellSize.width * itemDimensions.width,
            height: cellSize.height * itemDimensions.height,
          }}
        />
      </Animated.View>
    )}
  </>
);
};

const styles = StyleSheet.create({
  draggable: {
    position: 'absolute',
  },
  snapHighlight: {
    backgroundColor: 'rgba(0, 150, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(0, 150, 255, 0.7)',
    borderRadius: 4,
  },
  selectedOutline: {
  borderWidth: 2,
  borderColor: 'red',
  borderRadius: 4,
},
});

export default Draggable;
