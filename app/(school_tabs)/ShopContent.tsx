import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../../assets/normalize';
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon } from "../../assets/images/homeIcons"
import { ShopBackground } from "../../assets/images/shopIcons"
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isTablet = width > 1080;

const selectors = [
  'Hats',
  'Face Accessories',
  'Facial Expression',
  'Upperwear',
  'Lowerwear',
  'Shoes',
];

const items = [
  { id: 1, name: 'Hat of Wisdom', category: 'Hats', price: 100, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 2, name: 'Cool Shades', category: 'Face Accessories', price: 150, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 3, name: 'Smile', category: 'Facial Expression', price: 120, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 4, name: 'Iron Shirt', category: 'Upperwear', price: 200, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 5, name: 'Leather Pants', category: 'Lowerwear', price: 180, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 6, name: 'Combat Boots', category: 'Shoes', price: 130, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 7, name: 'Fedora', category: 'Hats', price: 90, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 8, name: 'Eye Patch', category: 'Face Accessories', price: 60, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 9, name: 'Angry Face', category: 'Facial Expression', price: 70, image: require('../../assets/images/homeIcons/avatar.png') },
];

type SelectorTabs = 'Hats' | 'Face Accessories' | 'Facial Expression' | 'Upperwear' | 'Lowerwear' | 'Shoes';
const ITEMS_PER_PAGE = 6;

const selectorIcons: { [key in SelectorTabs]: any } = {
  Hats: HeartIcon,
  'Face Accessories': HeartIcon,
  'Facial Expression': HeartIcon,
  Upperwear: HeartIcon,
  Lowerwear: HeartIcon,
  Shoes: HeartIcon,
};

const ShopScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Hats');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const filteredItems = items.filter(item => item.category === selectedTab);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={normalize(10)} color="#3a2e1f" />
          </View>
        </TouchableOpacity>
        <View style={styles.shopTitleWrapper}>
          <View style={styles.shopTitleBackground}>
            <Text style={styles.topBarTitle}>Shop</Text>
            <View style={styles.shopTitleShadow} />
          </View>
        </View>

        <View style={styles.topBarSpacer} />
      </View>
      <ImageBackground
        source={ ShopBackground} 
        style={styles.screen}
        resizeMode="cover" 
      >
      {/* Main Shop UI */}
      <View style={styles.container}>
        {/* Selector Tabs */}
        <View style={styles.outerBorder}>
          <View style={styles.secondBorder}>
            <View style={styles.thirdBorder}>
                <ScrollView
                  style={styles.selectorPane}
                  contentContainerStyle={[
                    styles.selectorContent,
                    { justifyContent: "space-between" },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {selectors.map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.selectorButton,
                        selectedTab === tab && styles.selectorButtonActive,
                      ]}
                      onPress={() => {
                        setSelectedTab(tab);
                        setCurrentPage(1);
                      }}
                    >
                      <Image
                        source={selectorIcons[selectedTab as keyof typeof selectorIcons]}
                        style={styles.selectorIcon}
                      />
                    </TouchableOpacity>
                  ))}
                  <View style={styles.imaginaryCard} />
                </ScrollView>
            </View>
          </View>
        </View>


        {/* Item List */}
        <View style={styles.leftPane}>
          <Text style={styles.title}>{selectedTab}</Text>
          <View style={styles.gridContainer}>
            {[...itemsToDisplay, ...Array(ITEMS_PER_PAGE - itemsToDisplay.length).fill(null)].map((item, index) => (
              <TouchableOpacity
                key={item ? item.id : `placeholder-${index}`}
                style={[
                  styles.itemCard,
                  item && item.id === activeItemId && styles.itemCardActive,
                ]}
                onPress={() => {
                  if (item) {
                    setActiveItemId(item.id); // Set the clicked item as active
                    console.log(`Pressed ${item.name}`);
                  }
                }}
                activeOpacity={item ? 0.7 : 1}
              >
                {item ? (
                  <>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Image source={item.image} style={styles.itemImage} />
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => {
                        console.log(`Buying ${item.name} for ${item.price} Ikicoins`);
                        // Add your buying logic here
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.priceContainer}>
                        <Text style={styles.buyButtonText}>{item.price}</Text>
                        <Image source={IkicoinIcon} style={styles.coinIcon} />
                      </View>
                    </TouchableOpacity>

                  </>
                ) : (
                  <>
                    <View style={[styles.itemImage, { justifyContent: 'center', alignItems: 'center' }]}>
                      <Ionicons name="lock-closed" size={normalize(10)} color="#bbb" />
                    </View>
                    <Text style={styles.itemText}>Coming Soon</Text>
                    <View style={[styles.buyButton, { backgroundColor: '#ddd', borderColor: '#aaa' }]}>
                      <Text style={[styles.buyButtonText, { color: '#999' }]}>TBD</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>

          

          {/* Pagination */}
          <View style={styles.paginationWrapper}>
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={goToPreviousPage}
                disabled={currentPage === 1}
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
              >
                <Ionicons name="chevron-back" size={normalize(10)} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.pageIndicator}>
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
              >
                <Ionicons name="chevron-forward" size={normalize(10)} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Avatar Preview */}
        <View style={styles.rightPane}>
          <Text style={styles.title}>Your Avatar</Text>
          <Image
            source={require('../../assets/images/homeIcons/avatar.png')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
      </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: normalize(2),
    backgroundColor: '#bfa76f',
    borderBottomWidth: normalize(0.5),
    borderColor: '#7a5e3a',
    elevation: 4,
  },
  backButton: {
    padding: normalize(2),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(12),
    borderWidth: normalize(1),
    borderColor: '#7a5e3a',
    backgroundColor: '#dbc397',
  },
  topBarTitle: {
    fontSize: normalize(9),
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  topBarSpacer: {
    width: normalize(40),
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    padding: normalize(3),
    gap: normalize(4),
  },
  
  selectorContent: {
    alignItems: 'center',
    gap: normalize(2),
  },
  selectorButton: {
    flexDirection: 'row',
    paddingVertical: normalize(3),
    backgroundColor: '#cdb892',
    borderRadius: normalize(6),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorIcon: {
    width: normalize(12),
    height: normalize(12),
    paddingHorizontal: normalize(4),
  },
  selectorButtonActive: {
    backgroundColor: '#a37b44',
    borderColor: '#5e4021',
  },
  selectorText: {
    fontSize: normalize(4),
    color: '#3a2e1f',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  leftPane: {
    flex: 8,
    backgroundColor: '#fff7db',
    padding: normalize(3),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    elevation: 4,
    flexDirection: 'column',
    marginHorizontal: normalize(10),
    justifyContent: 'space-between',
  },
  rightPane: {
    flex: 4,
    backgroundColor: '#fff7db',
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    marginRight: normalize(10),
    borderColor: '#8a6e43',
    padding: normalize(3),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  title: {
    fontSize: normalize(8),
    fontWeight: 'bold',
    color: '#3a2e1f',
    borderBottomWidth: normalize(1),
    borderColor: '#8a6e43',
    paddingBottom: normalize(1),
    marginBottom: normalize(3),
  },
  avatarImage: {
    width: isTablet ? normalize(300) : normalize(80),
    height: isTablet ? normalize(300) : normalize(80),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: normalize(4),
  },
  itemCard: {
    width: (width * 0.66 - normalize(100)) / 3,
    aspectRatio: 2,
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    padding: normalize(2),
    marginBottom: normalize(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemCardActive: {
    borderColor: '#ffba08',
    borderWidth: 2,
    backgroundColor: '#ffe5b4',
  },
  itemImage: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: normalize(5),
    color: '#3a2e1f',
    textAlign: 'center',
    marginVertical: normalize(1),
  },
  buyButton: {
    backgroundColor: '#a37b44',
    paddingVertical: normalize(1.5),
    paddingHorizontal: normalize(3),
    borderRadius: normalize(5),
    borderWidth: normalize(1),
    borderColor: '#5e4021',
    alignItems: 'center',
    alignContent: 'center',
  },
  buyButtonText: {
    fontSize: normalize(5),
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationWrapper: {
    marginTop: 'auto',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(25),
    gap: normalize(2),
  },
  paginationButton: {
    backgroundColor: '#a37b44',
    padding: normalize(1),
    borderRadius: normalize(5),
    borderWidth: normalize(1),
    borderColor: '#5e4021',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#aaa',
  },
  pageIndicator: {
    fontSize: normalize(5),
    color: '#3a2e1f',
    fontWeight: 'bold',
  },
  imaginaryCard: {
    padding: normalize(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imaginaryCardText: {
    fontSize: normalize(6),
    color: '#3a2e1f',
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(1),
  },

  coinIcon: {
    width: normalize(5.5),
    height: normalize(5.5),
    resizeMode: 'contain',
    marginLeft: normalize(1),
  },
shopTitleWrapper: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},

shopTitleBackground: {
  backgroundColor: '#d2a679', // rustic brownish bg
  paddingVertical: normalize(3),
  paddingHorizontal: normalize(12),
  borderRadius: normalize(5),
  borderWidth: normalize(2),
  borderColor: '#6b6463',
  position: 'relative',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
  elevation: 5,
},

shopTitleShadow: {
  position: 'absolute',
  bottom: normalize(0),
  left: normalize(.5),
  right: normalize(.5),
  height: normalize(10),
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  borderTopLeftRadius: normalize(20),
  borderTopRightRadius: normalize(20),
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  opacity: 0.3,
  transform: [{ scaleX: -1 }], // Flips the top semicircle shape vertically
},
outerBorder: {
  flex: 1.2,
  borderRadius: normalize(3),
  borderWidth: normalize(1.7),
  borderColor: '#6b6463',
  backgroundColor: '6b6463',
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
  marginLeft: normalize(10),
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
selectorPane: {
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

export default ShopScreen;
