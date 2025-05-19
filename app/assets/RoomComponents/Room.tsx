import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Draggable from './Draggable';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const initialItems = [
  { id: 1, x: screenWidth/20*3, y: screenHeight/10*4, itemDimensions: {width: 1, height: 1}, state: 'floor'},
  { id: 2, x: screenWidth/20*4, y: screenHeight/10*5, itemDimensions: {width: 1, height: 1}, state: 'wall' },
  { id: 3, x: screenWidth/20*5, y: screenHeight/10*6, itemDimensions: {width: 1, height: 1} },
  { id: 4, x: screenWidth/20*6, y: screenHeight/10*7, itemDimensions: {width: 1, height: 1} },
];

const Grid: React.FC = () => {
  const cellSize = { width: screenWidth/20, height: screenHeight/10 };
  const gridSize = { width: 1, height: 1};
  const gridDimensions = { width: screenWidth, height: screenHeight};
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    }, [items]);

  // Handle position update after item is dropped
  const updateItemPosition = (id: number, newPosition: { x: number; y: number }) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, x: newPosition.x, y: newPosition.y } : item
      )
    );
  };

  const updateCellSize = (cellSize: {width: number, height: number},
      itemDimensions: {width: number, height: number}) => {
        return {
          width: Math.round(cellSize.width * itemDimensions.width), 
          height: Math.round(cellSize.height * itemDimensions.height)
        }
  }

  const updateGridSize = (gridSize: {width: number, height: number},
      itemDimensions: {width: number, height: number}) => {
        return {
          width: Math.round(gridSize.width / itemDimensions.width), 
          height: Math.round(gridSize.height / itemDimensions.height)
        }
  }
  
  return (
    <View style={styles.grid}>
      <Image source={require('../../../assets/images/wallDefault.png')}  style={styles.wall}/>
      <Image source={require('../../../assets/images/floorDefault.png')}  style={styles.floor}/>
      {items.map((item) => (
        <Draggable
          key={`${item.id}-${item.x}-${item.y}`}
          imageSource={require('../../../assets/images/homeIcons/ikicoin.png')}
          currentPosition={({ x: item.x, y: item.y })}  // Pass updated position
          cellSize={updateCellSize(cellSize, item.itemDimensions)}
          itemDimensions={item.itemDimensions}
          gridSize={gridSize}
          gridDimensions={gridDimensions}
          state={item?.state ?? ''}
          onDrop={(newPosition) => updateItemPosition(item.id, newPosition)} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000000',
  },

  wall: {
    position: 'absolute',
    top: 0,
    width: screenWidth,
    height: screenHeight*.6
  },

  floor: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: screenHeight*.4
  }
});

export default Grid;
