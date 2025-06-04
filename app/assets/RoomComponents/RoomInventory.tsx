
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import FeatureButton from '../FeatureButton'
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../../assets/normalize';
import eventBus from '../utils/eventBus';

import { ShopBackground, FaceExIcon, FaceAccIcon, HatsIcon, ShoesIcon, LowerIcon, EyesIcon, UpperIcon} from "../../../assets/images/shopIcons";
import { useState, useEffect } from 'react';

interface RoomItem{
  id: number;
  item_name: string;
  type:string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: string;
  allowOverlap: boolean;
  placed: boolean;
  image: string;

}

const Inventory: React.FC = () => {
    
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [items, setItems] = useState<RoomItem[]>([]);

  // const items = [
  //   { id: 5, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 2}},
  //   { id: 6, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
  //   { id: 7, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 2, height: 1}},
  //   { id: 8, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 2, height: 2}},
  //   { id: 9, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
  //   { id: 10, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
  //   { id: 11, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
  //   { id: 12, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
    
  // ]
  const remainder = items.length % 3;
  const placeholdersCount = remainder === 0 ? 0 : 3 - remainder;

  const placeholders = new Array(placeholdersCount).fill(null);
  const filters = [
    { label: 'All', icon: HatsIcon},
    { label: 'Hats', icon: HatsIcon },
    { label: 'Eyes', icon: EyesIcon },
    { label: 'Face Accessories', icon: FaceAccIcon },
    { label: 'Face Expression', icon: FaceExIcon },
    { label: 'Upper', icon: UpperIcon },
    { label: 'Lower', icon: LowerIcon },
    { label: 'Shoes', icon: ShoesIcon },
  ];

  useEffect(() => {
    // Fetch room items from API on mount
    const fetchRoomItems = async () => {
      try {
        const response = await fetch('http://192.168.1.5:8081/api/room/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get_room_items',
            userID: 2,  // Replace with dynamic userID as needed
          }),
        });

        const data = await response.json();

        if (response.ok && data.room_items) {
          setItems(data.room_items);
        } else {
          console.error('API Error or no room_items:', data);
          setItems([]);
        }
      } catch (error) {
        console.error('Fetch room items failed:', error);
        setItems([]);
      }
    };

    fetchRoomItems();
  }, []);
  
  return (
    <View style={styles.inventory}>
      <View style={styles.filter}>
        <View style={styles.outerBorder}>
        <View style={styles.secondBorder}>
        <View style={styles.thirdBorder}>
        <View style={styles.filterBox}>
        </View>
        </View>
        </View>
        </View>
        {/* You can put anything here: nav, icons, tabs, etc. */}
      </View>
      <View style={styles.view}>
          
          <View style={styles.grid}>
          {items.map((item) => (
           <FeatureButton
              key={item.id}
              style={styles.item}
              onPress={() => eventBus.emit("newItem", item)}
              size={normalize(20)}
              icon={
                <Image
                  source={{ uri: item.image }}
                  style={{ resizeMode: 'cover' }}
                />
              }
            />

            ))}
            {placeholders.map((_, index) => (
              <View key={`placeholder-${index}`} style={[styles.item, styles.placeholder]} />
            ))}
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inventory: {
    zIndex: 10,
    flexDirection: 'row',
    position: 'absolute',
    marginLeft: '5%',
    width: '100%',
    height: '100%',
  },
  placeholder:{opacity:0},
  filter: {
    width: '25%',
    height: '80%',
    marginTop: '15%',
    backgroundColor: 'rgba(255, 200, 200, 0.8)', // example color
  },
  view: { 
    marginTop: '15%',
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },

  item: {
    position: 'relative',
    width: '30%', // adjust based on number of columns
    height: '30%',
    margin: '1.5%',
    backgroundColor: '#ccc',
    top: 0,
    left: 0,
  },

  button: {
    position: 'relative',
    margin: '-90%',
  },
  outerBorder: {
    height: '100%',
    borderWidth: normalize(1.7),
    borderColor: '#6b6463',
    backgroundColor: '#6b6463',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex:1,
  },
  secondBorder: {
    flex: 1,
    borderWidth: normalize(1),
    borderColor: "#a78e63",
    backgroundColor: "#a78e63",
  },
  thirdBorder: {
    flex: 1,
    borderWidth: normalize(1.5),
    borderColor: "#8f7549",
    borderRadius: normalize(1.5),
  },
  filterBox: {
    flex: 1,
    backgroundColor: '#d2a679',
    borderWidth: normalize(1),
    borderColor: '#6b6463',
    paddingVertical: normalize(4),
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default Inventory;
