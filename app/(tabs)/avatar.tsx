import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../../assets/normalize';
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon } from "../../assets/images/homeIcons"
import { ShopBackground, FaceExIcon, FaceAccIcon, HatsIcon, ShoesIcon, LowerIcon, EyesIcon, UpperIcon} from "../../assets/images/shopIcons"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as AvatarDisplay } from "../assets/avatar/avatarComponent";

const { width } = Dimensions.get('window');
const isTablet = width > 1080;

interface Item {
  item_id: number;
  item_name: string;
  store_image: string;
  avatar_image: string;
  price: number;
  part: string;
  category:string;
  
}

const selectors = [
  'Hat',
  'Eyes',
  'Face Accessories',
  'Facial Expression',
  'Upperwear',
  'Lowerwear',
  'Shoes',
];


type SelectorTabs = 'Hat' |'Eyes' |'Face Accessories' | 'Facial Expression' | 'Upperwear' | 'Lowerwear' | 'Shoes';
const ITEMS_PER_PAGE = 6;

const selectorIcons: { [key in SelectorTabs]: any } = {
  Hat: HatsIcon,
  Eyes: EyesIcon,
  'Face Accessories': FaceAccIcon,
  'Facial Expression': FaceExIcon,
  Upperwear: UpperIcon,
  Lowerwear: LowerIcon,
  Shoes: ShoesIcon,
};

const AvatarScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Hat');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [user, setUser] = useState<{
            userID: number;
          }>();
  
  const [userID, setUserID] = useState<number | null>(null);
  const filteredItems = items.filter(item => item.part === selectedTab);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

  const [previewedItem, setPreviewedItem] = useState<Item | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchUserAndInventory = async () => {
      try {
        // Step 1: Fetch user data
        const userData = await AsyncStorage.getItem("user");
        let userID = null;

        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (typeof parsedUser === "number") {
            setUser({ userID: parsedUser });
            userID = parsedUser;
            setUserID(parsedUser)
          } else {
            setUser(parsedUser);
            setUserID(parsedUser)
            userID = parsedUser.userID;
          }
          console.log("User ID:", userID);
        }

        // Step 2: Fetch inventory after user data is available
        if (userID) {
          const response = await fetch('http://192.168.1.5:8081/api/display-inventory-avatar/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch inventory');
          }

          const data = await response.json();
          setItems(data.accessories_items || []);
          console.log("Fetched inventory for user:", userID);
        } else {
          console.warn("User ID not found, inventory fetch skipped.");
        }
      } catch (error) {
        console.error("Error in fetchUserAndInventory:", error);
      }
    };

    fetchUserAndInventory();
  }, []);

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={normalize(10)} color="#3a2e1f" />
          </View>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Avatar Customization</Text>
        <View style={styles.topBarSpacer} />
      </View>

      {/* Main Avatar UI */}
      <View style={styles.container}>
        {/* Selector Tabs */}
        <ScrollView
          style={styles.selectorPane}
          contentContainerStyle={[styles.selectorContent, { justifyContent: 'space-between' }]}
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
              <Image source={selectorIcons[selectedTab as keyof typeof selectorIcons]} style={styles.selectorIcon} />
              <Text
                style={[
                  styles.selectorText,
                  selectedTab === tab && styles.selectorTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
            
          ))}
          {/* Imaginary Card */}
          <View style={styles.imaginaryCard} />
        </ScrollView>

        {/* Item List */}
        <View style={styles.leftPane}>
          <Text style={styles.title}>{selectedTab}</Text>
          <View style={styles.gridContainer}>
            {[...itemsToDisplay, ...Array(ITEMS_PER_PAGE - itemsToDisplay.length).fill(null)].map((item, index) => (
              <TouchableOpacity
                key={item ? item.item_id : `placeholder-${index}`}
                style={[
                  styles.itemCard,
                  item && item.item_id === activeItemId && styles.itemCardActive,
                ]}
                onPress={() => {
                  if (item) {
                    setActiveItemId(item.item_id); // Set the clicked item as active
                    setPreviewedItem(item);        // set previewed item
                    setShowSaveButton(true);       // show save button
                    console.log(`Pressed ${item.item_name}`);
                  }
                }}
                activeOpacity={item ? 0.7 : 1}
              >
                {item ? (
                  <>
                    <Image source={{uri: item.store_image}} style={styles.itemImage} />
                    <Text style={styles.itemText}>{item.item_name}</Text>
                    {/*<View style={styles.buyButton}>
                      <Text style={styles.buyButtonText}>{item.price} G</Text>
                    </View>*/}
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
          <AvatarDisplay userID={userID!}
            overrideHat = {previewedItem?.part === "Hat" ? previewedItem.avatar_image : undefined}
            overrideEyes = {previewedItem?.part === "Eyes" ? previewedItem.avatar_image : undefined}
            overrideFaceAccessories = {previewedItem?.part === "FaceAccessories" ? previewedItem.avatar_image : undefined}
            overrideFacialExpression = {previewedItem?.part === "FacialExpression" ? previewedItem.avatar_image : undefined}
            overrideUpperwear = {previewedItem?.part === "Upperwear" ? previewedItem.avatar_image : undefined}
            overrideLowerwear = {previewedItem?.part === "Lowerwear" ? previewedItem.avatar_image : undefined}
            overrideShoes = {previewedItem?.part === "Shoes" ? previewedItem.avatar_image : undefined}
            />
          {showSaveButton && previewedItem && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={async () => {
                try {
                  const response = await fetch('http://192.168.1.5:8081/api/retrieve-avatar/', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID,
                      item_type: previewedItem.part,
                      url: previewedItem.avatar_image
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Failed to equip item');
                  }

                  const result = await response.json();
                  console.log('Item equipped:', result);

                  setShowSaveButton(false);
                  setPreviewedItem(null); // clear preview
                } catch (error) {
                  console.error('Equip Error:', error);
                }
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f2ead3',
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
    color: '#3a2e1f',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0.5, height: 0.5 },
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
  selectorPane: {
    flex: 1,
    backgroundColor: '#f7e6b8',
    borderRadius: normalize(10),
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(3),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  selectorContent: {
    alignItems: 'center',
    gap: normalize(2),
  },
  selectorButton: {
    flexDirection: 'row',
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    backgroundColor: '#cdb892',
    borderRadius: normalize(6),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    width: '100%',
    alignItems: 'center',
  },
  selectorIcon: {
    width: normalize(12),
    height: normalize(12),
    marginRight: normalize(6),
  },
  selectorButtonActive: {
    backgroundColor: '#a37b44',
    borderColor: '#5e4021',
  },
  selectorText: {
    fontSize: normalize(5),
    color: '#3a2e1f',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  leftPane: {
    flex: 2,
    backgroundColor: '#fff7db',
    padding: normalize(3),
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    elevation: 4,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightPane: {
    flex: 1,
    backgroundColor: '#fff7db',
    borderRadius: normalize(10),
    borderWidth: normalize(1),
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
    padding: normalize(2),
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
    backgroundColor: '#f7e6b8',
    borderRadius: normalize(10),
    padding: normalize(3),
    marginTop: normalize(10),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  imaginaryCardText: {
    fontSize: normalize(6),
    color: '#3a2e1f',
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#fdd835',
    padding: normalize(10),
    borderRadius: normalize(5),
    marginTop: normalize(10),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  saveButtonText: {
    color: '#3a2e1f',
    fontWeight: 'bold',
    fontSize: normalize(10),
  },
});

export default AvatarScreen;
