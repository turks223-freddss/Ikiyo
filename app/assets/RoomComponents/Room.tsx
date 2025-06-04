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
  width: number;
  height: number;
  state?: string;
  allowOverlap?: boolean;
  image:string
}

const initialItems: Item[] = [
  { id: 1, x: screenWidth / 20 * 3, y: screenHeight / 10 * 4,   width: 1, height: 1 , state: 'floor', image: "https://res.cloudinary.com/dlz7oiktg/image/upload/v1749070958/coin-ico_ilmlxc.png" },
  { id: 2, x: screenWidth / 20 * 4, y: screenHeight / 10 * 5,   width: 1, height: 1 , state: 'wall', image:"https://res.cloudinary.com/dlz7oiktg/image/upload/v1749070958/coin-ico_ilmlxc.png" },
  { id: 3, x: screenWidth / 20 * 5, y: screenHeight / 10 * 6,   width: 1, height: 1 ,image:"https://res.cloudinary.com/dlz7oiktg/image/upload/v1749070958/coin-ico_ilmlxc.png" },
  { id: 4, x: screenWidth / 20 * 6, y: screenHeight / 10 * 7,   width: 1, height: 1 , allowOverlap: true ,image:"https://res.cloudinary.com/dlz7oiktg/image/upload/v1749070958/coin-ico_ilmlxc.png"},
];

const Grid: React.FC = () => {
  const baseCellSize = { width: screenWidth / 20, height: screenHeight / 10 };
  const gridSize = { width: 1, height: 1 };
  const gridDimensions = { width: screenWidth, height: screenHeight };

  const [items, setItems] = useState<Item[]>(initialItems);
  
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Set<number>>(new Set());
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [version, setVersion] = useState(0);

  const getCellSizeForItem = (item: Item) => {
    if (item.state === 'wall') {
      return {
        width: baseCellSize.width,
        height: (screenHeight * 0.6) / 6,
      };
    } else if (item.state === 'floor') {
      return {
        width: baseCellSize.width,
        height: (screenHeight * 0.4) / 4,
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

  const calculateOccupiedGridCells = (items: Item[], excludeId: number) => {
    const occupied: { col: number; row: number }[] = [];
    items.forEach(item => {
      if (item.id === excludeId) return;
      const cellSize = getCellSizeForItem(item);
      const { col: startCol, row: startRow } = positionToGridCell({ x: item.x, y: item.y }, cellSize, item.state);

      for (let dx = 0; dx < item.width; dx++) {
        for (let dy = 0; dy < item.height; dy++) {
          occupied.push({ col: startCol + dx, row: startRow + dy });
        }
      }
    });
    return occupied;
  };

  const updateItemPosition = (id: number, newPosition: { x: number; y: number }) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, x: newPosition.x, y: newPosition.y } : item
      )
    );
    setVersion(v => v + 1);
  };

  const deleteSelectedItems = () => {
    setItems(prev => prev.filter(item => !selectedItem.has(item.id)));
    setVersion(v => v + 1);
  };

  const selectedItemHandler = (id: number) => {
    const newSet = new Set<number>();
    newSet.add(id);
    setSelectedItem(newSet);
  };

  // Inventory open/close
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

  // Delete Button Toggle
  useEffect(() => {
    const toggleDeleteMode = () => {
      setIsDeleteMode(prev => !prev);
      setVersion(v => v + 1);
    };

    eventBus.on("deleteItem", toggleDeleteMode);
    return () => {
      eventBus.off("deleteItem", toggleDeleteMode)
    };
  }, []);

  // Delete Item
  useEffect(() => {
    if (isDeleteMode && selectedItem.size > 0) {
      deleteSelectedItems();
    }
  }, [selectedItem]);

  // Add Item from Inventory
  useEffect(() => {
    const addNewItem = (item: Item) => {
      setItems(prev => [...prev, item]);
      setVersion(v => v + 1);
      eventBus.emit("closeInventory");
    };

    eventBus.on("newItem", addNewItem);
    return () =>{
      eventBus.off("newItem", addNewItem)
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
            imageSource={item.image}
            currentPosition={{ x: item.x, y: item.y }}
            cellSize={cellSize}
            width={item.width}
            height={item.height}
            gridSize={gridSize}
            gridDimensions={gridDimensions}
            state={item.state ?? ''}
            onDrop={(newPos) => updateItemPosition(item.id, newPos)}
            occupiedGridCells={occupiedGridCells}
            allowOverlap={item.allowOverlap ?? false}
            onSelect={() => isDeleteMode && selectedItemHandler(item.id)}
            isDeleteMode={isDeleteMode}
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
