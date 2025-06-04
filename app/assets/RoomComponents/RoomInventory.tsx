import { View, Image, StyleSheet, Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import FeatureButton from '../FeatureButton'
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../../assets/normalize';
import eventBus from '../utils/eventBus';

const Inventory: React.FC = () => {

    /* NOTE TO DEV:
        Implement fetching of items/furniture here    
    */

  const items = [
    { id: 5, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 2}},
    { id: 6, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
    { id: 7, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 2, height: 1}},
    { id: 8, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 2, height: 2}},
    { id: 9, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
    { id: 10, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
    { id: 11, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
    { id: 12, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 1}},
    
  ]
  
  return (
    <View style={styles.inventory}>
        <Image source={require('../../../assets/images/jobee_2.jpg')}  style={styles.view}/>
        <FeatureButton
            style={styles.button}
            onPress={() => eventBus.emit("closeInventory")}
            icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
            size={normalize(20)}
        />
        <View style={styles.grid}>
        {items.map((item) => (
          <FeatureButton
              style={styles.item}
              onPress={() => eventBus.emit("newItem", item)}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
          />
          ))}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inventory: {
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  view: { 
    position: 'absolute',
    height: '100%',
    width: '100%'
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },

  item: {
    position: 'relative',
    width: '40%', // adjust based on number of columns
    aspectRatio: 1,
    margin: '1.5%',
    backgroundColor: '#ccc',
    top: 0,
    left: 0,
  },

  button: {
    position: 'relative',
    margin: 20
  },
});

export default Inventory;
