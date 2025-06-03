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
  
  return (
    <View style={styles.inventory}>
        <Image source={require('../../../assets/images/jobee_2.jpg')}  style={styles.view}/>
        <FeatureButton
            style={styles.button}
            onPress={() => eventBus.emit("closeInventory")}
            icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
            size={normalize(20)}
        />

        <FeatureButton
            style={styles.item}
            onPress={() => eventBus.emit("newItem", { id: 5, x: screenWidth/20*7, y: screenHeight/10*8, itemDimensions: {width: 1, height: 2}})}
            icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
            size={normalize(20)}
        />
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
    height: '120%'
  },

  item: {
    position: 'relative',
    top: 0,
    left: 0,
    margin: 20
  },

  button: {
    position: 'relative',
    margin: 20
  },
});

export default Inventory;
