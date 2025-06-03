import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Draggable from './Draggable';
import RoomInventory from './RoomInventory';
import eventBus from "../utils/eventBus";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Item {
  id: number;
  x: number;
  y: number;
  itemDimensions: {
    width: number;
    height: number;
  };
  state?: string;
  allowOverlap?: boolean;
}

const initialItems: Item[] = [
  { id: 1, x: screenWidth / 20 * 3, y: screenHeight / 10 * 4, itemDimensions: { width: 1, height: 1 }, state: 'floor' },
  { id: 2, x: screenWidth / 20 * 4, y: screenHeight / 10 * 5, itemDimensions: { width: 1, height: 1 }, state: 'wall' },
  { id: 3, x: screenWidth / 20 * 5, y: screenHeight / 10 * 6, itemDimensions: { width: 1, height: 1 } },
  { id: 4, x: screenWidth / 20 * 6, y: screenHeight / 10 * 7, itemDimensions: { width: 1, height: 1 }, allowOverlap: true },
];

const Grid: React.FC = () => {
  const baseCellSize = { width: screenWidth / 20, height: screenHeight / 10 };
  const gridSize = { width: 1, height: 1 };
  const gridDimensions = { width: screenWidth, height: screenHeight };
  const [items, setItems] = useState(initialItems);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [version, setVersion] = useState(0);

  const getCellSizeForItem = (item: Item) => {
    const originalHeight = screenHeight;
    if (item.state === 'wall') {
      const wallHeight = originalHeight * 0.6;
      return {
        width: baseCellSize.width,
        height: wallHeight / 6,
      };
    } else if (item.state === 'floor') {
      const floorHeight = originalHeight * 0.4;
      return {
        width: baseCellSize.width,
        height: floorHeight / 4,
      };
    }

    return baseCellSize;
  };

  const positionToGridCell = (pos: { x: number; y: number }, cellSize: { width: number; height: number }, state?: string) => {
    const offsetY = state === 'floor' ? screenHeight * 0.6 : 0;
    const col = Math.round(pos.x / cellSize.width);
    const row = Math.round((pos.y - offsetY) / cellSize.height);
    return { col, row };
  };

  const gridCellToPosition = (cell: { col: number; row: number }, cellSize: { width: number; height: number }, state?: string) => {
    const offsetY = state === 'floor' ? screenHeight * 0.6 : 0;
    return { x: cell.col * cellSize.width, y: cell.row * cellSize.height + offsetY };
  };

  const calculateOccupiedGridCells = (items: Item[], excludeId: number) => {
    const occupied: { col: number; row: number }[] = [];
    items.forEach(item => {
      if (item.id === excludeId) return;

      const cellSize = getCellSizeForItem(item);
      const { col: startCol, row: startRow } = positionToGridCell({ x: item.x, y: item.y }, cellSize, item.state);

      for (let dx = 0; dx < item.itemDimensions.width; dx++) {
        for (let dy = 0; dy < item.itemDimensions.height; dy++) {
          occupied.push({ col: startCol + dx, row: startRow + dy });
        }
      }
    });
    return occupied;
  };

  const updateItemPosition = (id: number, newPosition: { x: number; y: number }) => {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, x: newPosition.x, y: newPosition.y } : item
      )
    );
    setVersion(v => v + 1);
  };

  useEffect(() => {
    const addNewItem = (item: Item) => {
      setItems(prevItems => [...prevItems, item]);
      eventBus.emit("closeInventory");
      setVersion(v => v + 1);
    };

    eventBus.on("newItem", addNewItem);

    return () => {
      eventBus.off("newItem", addNewItem);
    };
  }, []);

  useEffect(() => {
    const handleOpenInventory = () => setIsInventoryOpen(true);
    const handleCloseInventory = () => setIsInventoryOpen(false);

    eventBus.on("openInventory", handleOpenInventory);
    eventBus.on("closeInventory", handleCloseInventory);

    return () => {
      eventBus.off("openInventory", handleOpenInventory);
      eventBus.off("closeInventory", handleCloseInventory);
    };
  }, []);

  return (
    <View style={styles.grid}>
      <Image source={require('../../../assets/images/wallDefault.png')} style={styles.wall} />
      <Image source={require('../../../assets/images/floorDefault.png')} style={styles.floor} />
      {items.map(item => {
        const cellSize = getCellSizeForItem(item);
        const occupiedGridCells = calculateOccupiedGridCells(items, item.id);

        return (
          <Draggable
            key={`${item.id}-${item.x}-${item.y}-${version}`}
            imageSource={require('../../../assets/images/homeIcons/ikicoin.png')}
            currentPosition={{ x: item.x, y: item.y }}
            cellSize={cellSize}
            itemDimensions={item.itemDimensions}
            gridSize={gridSize}
            gridDimensions={gridDimensions}
            state={item.state ?? ''}
            onDrop={(newPos) => updateItemPosition(item.id, newPos)}
            occupiedGridCells={occupiedGridCells}
            allowOverlap={item.allowOverlap ?? false}
          />
        );
      })}
      {isInventoryOpen && (
        <View style={styles.inventory}>
          <RoomInventory />
        </View>
      )}
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
  inventory: {
    position: 'absolute',
    margin: 20,
    width: screenWidth * 0.3,
    height: screenHeight * 0.95,
  },
  wall: {
    position: 'absolute',
    top: 0,
    width: screenWidth,
    height: screenHeight * 0.6,
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: screenHeight * 0.4,
  },
});

export default Grid;
