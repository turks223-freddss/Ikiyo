import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Animated,

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../../assets/normalize';
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon } from "../../assets/images/homeIcons"
import { ShopBackground, FaceExIcon, FaceAccIcon, HatsIcon, ShoesIcon, LowerIcon, EyesIcon, UpperIcon} from "../../assets/images/shopIcons"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CurrencyDisplay from "../assets/CurrencyContainer";
import { default as AvatarDisplay } from "../assets/avatar/avatarComponentShop";

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
interface UserData {
  userID: number;
  username: string;
  email: string;
  password: string;
  gold: number;
  ruby: number;
  description: string | null;
  buddy: number| null;
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

const roomSelectors = [
  'Wallpaper',
  'Flooring',
  'Wall Item',
  'Floor Item',
];

type RoomSelectorTabs = 'Wallpaper' | 'Flooring' | 'Wall Item' | 'Floor Item';

type SelectorTabs = 'Hat' |'Eyes' |'Face Accessories' | 'Facial Expression' | 'Upperwear' | 'Lowerwear' | 'Shoes';
const ROOM_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE = 6; // keep for avatar

const selectorIcons: { [key in SelectorTabs]: any } = {
  Hat: HatsIcon,
  Eyes: EyesIcon,
  'Face Accessories': FaceAccIcon,
  'Facial Expression': FaceExIcon,
  Upperwear: UpperIcon,
  Lowerwear: LowerIcon,
  Shoes: ShoesIcon,
};

const ShopScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Hats');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]); // Store fetched items
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
          userID: number;
        } | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

  const filteredItems = items.filter(item => item.part === selectedTab);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);
  const [ownedItemIds, setOwnedItemIds] = useState<number[]>([]);
  
  const [avatarPreview, setAvatarPreview] = useState<{
    Hat?: string;
    Eyes?: string;
    'Face Accessories'?: string;
    'Facial Expression'?: string;
    Upperwear?: string;
    Lowerwear?: string;
    Shoes?: string;
  }>({});

  const [selectedShop, setSelectedShop] = useState<'avatar' | 'room'>('avatar');
  const shopIndicator = useRef(new Animated.Value(0)).current;

  const [selectedRoomTab, setSelectedRoomTab] = useState<RoomSelectorTabs>('Wallpaper');
  const [roomCurrentPage, setRoomCurrentPage] = useState(1);
  const [roomActiveItemId, setRoomActiveItemId] = useState<number | null>(null);
  const [roomItems, setRoomItems] = useState<Item[]>([]); // You may want a separate fetch for room items

  const filteredRoomItems = roomItems.filter(item => item.part === selectedRoomTab);
  const roomTotalPages = Math.ceil(filteredRoomItems.length / ROOM_ITEMS_PER_PAGE);
  const roomStartIndex = (roomCurrentPage - 1) * ROOM_ITEMS_PER_PAGE;
  const roomEndIndex = roomStartIndex + ROOM_ITEMS_PER_PAGE;
  const roomItemsToDisplay = filteredRoomItems.slice(roomStartIndex, roomEndIndex);

  useEffect(() => {
    Animated.timing(shopIndicator, {
      toValue: selectedShop === 'avatar' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [selectedShop]);

  const indicatorTranslate = shopIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, normalize(75)], // adjust based on width of each tab
  });


  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('http://192.168.1.5:8081/api/items/');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async (item: Item) => {
  if (!user || !user.userID) return;

  try {
    const response = await fetch("http://192.168.1.5:8081/api/buy-item/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: user.userID,
        item_id: item.item_id,
        price: item.price,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.detail || "Purchase failed.");
      return;
    }

    const data = await response.json();
    alert(data.message || "Item purchased!");
    await fetchOwnedItems();
    // Update local gold/ruby after successful purchase
    setUserData((prev) =>
      prev ? { ...prev, gold: prev.gold - item.price } : prev
    );

  } catch (error) {
    console.error("Error buying item:", error);
    alert("Something went wrong while purchasing.");
  }
};

const fetchOwnedItems = async () => {
  if (!user || !user.userID) return;

  try {
    const response = await fetch("http://192.168.1.5:8081/api/user-inventory/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: user.userID }),
    });

    if (!response.ok) throw new Error("Failed to fetch inventory");

    const data = await response.json();
    setOwnedItemIds(data.owned_items); // Store owned item IDs
  } catch (error) {
    console.error("Error fetching owned items:", error);
  }
};



  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            if (typeof parsedUser === "number") {
              setUser({ userID: parsedUser }); // Convert number to object
            } else {
              setUser(parsedUser);
            }
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      };
      // #jandkjasdakdj
      fetchUserData();
    }, []);
  
    useEffect(() => {
        if (!user || !user.userID) return; // Prevent empty request
        // console.log("Current user:", user); // Debugging step
        
    
        const fetchUserData = () => {
          fetch("http://192.168.1.5:8081/api/user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: user.userID }),
          })
            .then(async (response) => {
              const text = await response.text(); // Read raw response
              return JSON.parse(text);
            })
            .then((data) => {
              setUserData(data);
            })
            .catch((error) => console.error("Error fetching user data:", error));
        };
        // Initial fetch when user changes
        fetchUserData();
        console.log("hello entered") 
    }, [user]); // Runs when `user` changes

  useEffect(() => {
    if (!user || !user.userID) return;
    fetchOwnedItems();
    fetchItems();
  }, [user]);

  // Remove the temporary mock items useEffect:
  useEffect(() => {
    if (selectedShop === 'room') {
      // When ready, fetch real room items here
      fetchRoomItems();
    }
  }, [selectedShop]);

  // Add this function to fetch real room items from your backend:
  const fetchRoomItems = async () => {
    try {
      // Example endpoint, adjust as needed
      const response = await fetch('http://192.168.1.5:8081/api/items/');
      if (!response.ok) throw new Error('Failed to fetch room items');
      
      const data = await response.json();
       const filteredRoomItems = data.filter((item:Item) => item.category === "Room");
      setRoomItems(filteredRoomItems);
    } catch (error) {
      console.error('Error fetching room items:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.shopTabWrapper}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={normalize(10)} color="#3a2e1f" />
          </View>
        </TouchableOpacity>
        <View style={styles.shopTitleWrapper}>
          <View style={styles.shopTitleBackground}>
        
        <View style={styles.shopTabBackground}>
          <Animated.View
            style={[styles.shopTabIndicator, { transform: [{ translateX: indicatorTranslate }] }]}
          />
          
          <TouchableOpacity
            style={styles.shopTabButton}
            onPress={() => setSelectedShop('avatar')}
          >
            <Animated.View
              style={[
                styles.shopTitleShadow,
                { transform: [{ translateX: indicatorTranslate }] }
              ]}
            />
            <Text style={[styles.shopTabText, selectedShop === 'avatar' && styles.activeTabText]}>
              Avatar Shop
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shopTabButton}
            onPress={() => setSelectedShop('room')}
          >
            <Text style={[styles.shopTabText, selectedShop === 'room' && styles.activeTabText]}>
              Room Shop
            </Text>
            
          </TouchableOpacity>
          
            </View>
          </View>
          
        </View>
        <View style={styles.currencyContainer}>
          <Text style={styles.activeTabText}>{userData?.gold??0}</Text>
          <Image source={IkicoinIcon} style={styles.currencyOwned} />
        </View>

      </View>

      <ImageBackground
        source={ ShopBackground} 
        style={styles.screen}
        resizeMode="cover" 
      >
        {selectedShop === 'avatar' ? (
          // Avatar item selectors and grid
          <>
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
                        source={selectorIcons[tab as keyof typeof selectorIcons]}
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
                key={item ? item.item_id : `placeholder-${index}`}
                style={[
                  styles.itemCard,
                  item && item.item_id === activeItemId && styles.itemCardActive,
                ]}
                onPress={() => {
                  if (item) {
                    setActiveItemId(item.item_id); // Set the clicked item as active
                    {console.log('Item:', item)}
                    console.log(`Pressed ${item.store_image}`);
                    setAvatarPreview((prev) => ({
                      ...prev,
                      [item.part]: item.avatar_image,
                    }));
                  }
                }}
                activeOpacity={item ? 0.7 : 1}
              >
                {item ? (
                  <>
                    <Text style={styles.itemText}>{item.item_name}</Text>
                    <Image source={{ uri: item.store_image } } style={styles.itemImage} />
                    <TouchableOpacity
                      style={[
                        styles.buyButton,
                        ownedItemIds.includes(item.item_id) && { backgroundColor: '#ccc' }
                      ]}
                      onPress={() => !ownedItemIds.includes(item.item_id) && handleBuyItem(item)}
                      disabled={ownedItemIds.includes(item.item_id)}
                      activeOpacity={ownedItemIds.includes(item.item_id) ? 1 : 0.7}
                    >
                      <View style={styles.priceContainer}>
                        <Text style={[
                          styles.buyButtonText,
                          ownedItemIds.includes(item.item_id) && { color: '#888' }
                        ]}>
                          {ownedItemIds.includes(item.item_id) ? "Owned" : item.price}
                        </Text>
                        {!ownedItemIds.includes(item.item_id) && (
                          <Image source={IkicoinIcon} style={styles.coinIcon} />
                        )}
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
          {/* <Text style={styles.title}>Your Avatar</Text> */}
          {user?.userID !== undefined && <AvatarDisplay userID={user.userID}
            hat={avatarPreview.Hat}
            eyes={avatarPreview.Eyes}
            faceAccessories={avatarPreview["Face Accessories"]}
            facialExpression={avatarPreview["Facial Expression"]}
            upperwear={avatarPreview.Upperwear}
            lowerwear={avatarPreview.Lowerwear}
            shoes={avatarPreview.Shoes}
           />}
        </View>
      </View>
          </>
        ) : (
          <View style={styles.container}>
            {/* Room Shop Selector Tabs */}
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
                    {roomSelectors.map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.selectorButton,
                          selectedRoomTab === tab && styles.selectorButtonActive,
                        ]}
                        onPress={() => {
                          setSelectedRoomTab(tab as RoomSelectorTabs);
                          setRoomCurrentPage(1);
                        }}
                      >
                        <Text style={{ fontWeight: selectedRoomTab === tab ? 'bold' : 'normal' }}>{tab}</Text>
                      </TouchableOpacity>
                    ))}
                    <View style={styles.imaginaryCard} />
                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Room Item List */}
            <View style={styles.leftPane}>
              <Text style={styles.title}>{selectedRoomTab}</Text>
              <View style={styles.gridContainer}>
                {[...roomItemsToDisplay, ...Array(ROOM_ITEMS_PER_PAGE - roomItemsToDisplay.length).fill(null)].map((item, index) =>
                  item ? (
                    <TouchableOpacity
                      key={item.item_id}
                      style={[
                        styles.itemCard,
                        item.item_id === roomActiveItemId && styles.itemCardActive,
                      ]}
                      onPress={() => {
                        setRoomActiveItemId(item.item_id);
                        // Optionally preview or select room item
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.itemText}>{item.item_name}</Text>
                      <Image
                        source={typeof item.store_image === 'string' ? { uri: item.store_image } : item.store_image}
                        style={styles.itemImage}
                      />
                      <TouchableOpacity
                        style={[
                          styles.buyButton,
                          item.category === "Avatar" && ownedItemIds.includes(item.item_id) && { backgroundColor: '#ccc' }
                        ]}
                        onPress={() =>
                          !(item.category === "Avatar" && ownedItemIds.includes(item.item_id)) &&
                          handleBuyItem(item)
                        }
                        disabled={item.category === "Avatar" && ownedItemIds.includes(item.item_id)}
                        activeOpacity={
                          item.category === "Avatar" && ownedItemIds.includes(item.item_id) ? 1 : 0.7
                        }
                      >
                        <View style={styles.priceContainer}>
                          <Text style={[
                            styles.buyButtonText,
                            item.category === "Avatar" && ownedItemIds.includes(item.item_id) && { color: '#888' }
                          ]}>
                            {item.category === "Avatar" && ownedItemIds.includes(item.item_id)
                              ? "Owned"
                              : item.price}
                          </Text>
                          {/* Show coin icon only if NOT an owned Avatar item */}
                          {!(item.category === "Avatar" && ownedItemIds.includes(item.item_id)) && (
                            <Image source={IkicoinIcon} style={styles.coinIcon} />
                          )}
                        </View>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ) : (
                    // "Coming Soon" placeholder for empty slots
                    <View
                      key={`placeholder-${index}`}
                      style={[styles.itemCard, { opacity: 0.5, justifyContent: 'center', alignItems: 'center' }]}
                    >
                      <View style={[styles.itemImage, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="lock-closed" size={normalize(10)} color="#bbb" />
                      </View>
                      <Text style={styles.itemText}>Coming Soon</Text>
                      <View style={[styles.buyButton, { backgroundColor: '#ddd', borderColor: '#aaa' }]}>
                        <Text style={[styles.buyButtonText, { color: '#999' }]}>TBD</Text>
                      </View>
                    </View>
                  )
                )}
              </View>

              {/* Pagination */}
              <View style={styles.paginationWrapper}>
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    onPress={() => setRoomCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={roomCurrentPage === 1}
                    style={[
                      styles.paginationButton,
                      roomCurrentPage === 1 && styles.disabledButton,
                    ]}
                  >
                    <Ionicons name="chevron-back" size={normalize(10)} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.pageIndicator}>
                    {roomCurrentPage} / {roomTotalPages}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setRoomCurrentPage((prev) => Math.min(prev + 1, roomTotalPages))}
                    disabled={roomCurrentPage === roomTotalPages}
                    style={[
                      styles.paginationButton,
                      roomCurrentPage === roomTotalPages && styles.disabledButton,
                    ]}
                  >
                    <Ionicons name="chevron-forward" size={normalize(10)} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

      
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  currencyContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: normalize(4),
  paddingVertical: normalize(4),
  backgroundColor: '#fff7db', // Soft background (customize as needed)
  borderRadius: normalize(20), // Oblong shape
  borderWidth: 2,
  borderColor: '#a78e63',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 1,
  elevation: 2,
},

currencyOwned: {
  width: normalize(12),
  height: normalize(12),
  resizeMode: 'contain',
},

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
    marginTop: normalize(20),
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
  left: normalize(3.7),
  right: normalize(5),
  height: normalize(8),
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
  shopTabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: normalize(2),
    backgroundColor: '#bfa76f',
    borderBottomWidth: normalize(0.5),
    borderColor: '#7a5e3a',
    elevation: 4,
},
shopTabBackground: {
  flexDirection: 'row',
  width: normalize(150),
  height: normalize(15),
  backgroundColor: '#ece4d9',
  borderRadius: normalize(10),
  position: 'relative',
},
shopTabIndicator: {
  position: 'absolute',
  height: '100%',
  width: normalize(75),
  backgroundColor: '#d9c3a1',
  borderRadius: normalize(10),
  zIndex: 0,
},
shopTabButton: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
shopTabText: {
  fontSize: normalize(7),
  color: '#5e4c35',
},
activeTabText: {
  fontWeight: 'bold',
  color: '#2e1f0d',
},
roomShopPlaceholder: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: normalize(10),
},
placeholderText: {
  fontSize: normalize(6.5),
  color: '#999',
},

});

export default ShopScreen;
