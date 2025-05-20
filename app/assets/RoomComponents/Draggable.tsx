import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

interface DraggableProps {
  imageSource: ImageSourcePropType;
  currentPosition: { x: number; y: number };  // Use currentPosition instead of initialPosition
  cellSize: { width: number; height: number };
  gridSize: { width: number; height: number };
  itemDimensions: {width: number, height: number};
  gridDimensions: { width: number; height: number };
  state: string;
  onDrop: (position: { x: number; y: number }) => void;
}

const Draggable: React.FC<DraggableProps> = ({
  imageSource,
  currentPosition,  // Accept current position from parent
  cellSize,
  gridSize,
  itemDimensions,
  gridDimensions,
  state,
  onDrop,
}) => {
  let position = useRef(new Animated.ValueXY(currentPosition)).current;

  let [draggingPos, setDraggingPos] = useState<{ x: number; y: number } | null>(null);

  let draggingRef = useRef<{ x: number; y: number }>({ x: currentPosition.x, y: currentPosition.y });

  useEffect(() => {
    position.setValue(currentPosition);  // Sync the position with the state
  }, [currentPosition]);

  const originalHeight = useRef(gridDimensions.height); // Save full height once
  let offsetY = 0;

    useEffect(() => {
    console.log(state);

    if (state === 'wall') {
        const wallHeight = originalHeight.current * 0.6;

        gridDimensions = {
        width: gridDimensions.width,
        height: wallHeight
        };
        cellSize = {
        width: cellSize.width,
        height: wallHeight / 6
        };
        offsetY = 0; // wall starts at the top
    } else if (state === 'floor') {
        const floorHeight = originalHeight.current * 0.4;

        gridDimensions = {
        width: gridDimensions.width,
        height: floorHeight
        };
        cellSize = {
        width: cellSize.width,
        height: floorHeight / 4
        };
        offsetY = originalHeight.current * 0.6; // floor starts after wall ends
    }
    console.log(offsetY)
    console.log(gridDimensions)
    }, [state]);

  useEffect(() => {
  }, [position]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({ x: currentPosition.x, y: currentPosition.y });
        position.setValue({ x: 0, y: 0 });
        setDraggingPos(null);
      },
      onPanResponderMove: (e, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });

        let moveX = currentPosition.x + gesture.dx;
        let moveY = currentPosition.y + gesture.dy;

        // Snap to grid logic
        let snapX = Math.round(moveX / cellSize.width) * cellSize.width;
        let snapY = Math.round(moveY / cellSize.height) * cellSize.height;

        const maxX = gridDimensions.width - gridSize.width * cellSize.width;
        const maxY = offsetY + (gridDimensions.height - gridSize.height * cellSize.height);

        snapX = Math.min(Math.max(0, snapX), maxX);
        snapY = Math.min(Math.max(offsetY, snapY), maxY);

        draggingRef.current = { x: snapX, y: snapY };
        setDraggingPos({ x: snapX, y: snapY });
      },
      onPanResponderRelease: (e, gesture) => {
        position.flattenOffset();

        let finalX = currentPosition.x + gesture.dx;
        let finalY = currentPosition.y + gesture.dy;

        let snappedX = Math.round(finalX / cellSize.width) * cellSize.width;
        let snappedY = Math.round(finalY / cellSize.height) * cellSize.height;

        const maxX = gridDimensions.width - gridSize.width * cellSize.width;
        const maxY = offsetY + (gridDimensions.height - gridSize.height * cellSize.height);

        snappedX = Math.min(Math.max(0, snappedX), maxX);
        snappedY = Math.min(Math.max(offsetY, snappedY), maxY);

        // Update position after drop
        Animated.spring(position, {
          toValue: { x: snappedX, y: snappedY },
          useNativeDriver: true,
        }).start();

        // Notify parent about the new position
        onDrop({ x: snappedX, y: snappedY });
      },
    })
  ).current;

  return (
    <>
      {draggingPos && (
        <View
          pointerEvents="none"
          style={[styles.snapHighlight, {
            width: (gridSize.width * cellSize.width) * itemDimensions.width,
            height: (gridSize.height * cellSize.height) * itemDimensions.height,
            left: draggingPos.x,
            top: draggingPos.y,
            position: 'absolute',
          }]}
        />
      )}
      <Animated.View {...panResponder.panHandlers} style={[position.getLayout(), styles.draggable]}>
        <Image source={imageSource} style={{ width: (gridSize.width * cellSize.width) * itemDimensions.width, height: (gridSize.height * cellSize.height) * itemDimensions.height }} />
      </Animated.View>
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
});

export default Draggable;
