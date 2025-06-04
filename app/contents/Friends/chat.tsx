import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { normalize } from "../../../assets/normalize";

type Props = {
  onBack: () => void;
  friendID: number; //for firend
  userID:number
};

type Message = {
  id: number;
  sender: number
  recipient: number
  content: string
  timestamp: string
  is_read: boolean
};

type chatPartner =  {
  name: string
  id: number
  status: string
}

export default function ChatScreen({ onBack, userID, friendID }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setchatPartner] = useState<chatPartner | null>(null);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);


  const CHAT_API_URL = "http://192.168.1.5:8081/api/chat/"; 
  
  useEffect(() => {
    fetchMessages();
    fetchPartner();
  }, []);

  useEffect(() => {
    if (chatPartner) {
      console.log("Chat Partner Data:", chatPartner);
    }
  }, [chatPartner]);

  const fetchPartner = async () => {
    const requestBody = {
      action: "get_friend_data",
      userID: userID,
      friend_id: friendID,
    };

    // Log the request body to see what data is being passed
    console.log("Request Body:", requestBody);
    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get_friend_data",
          userID: userID,
          friend_id: friendID,
        }),
      });

      const data = await response.json();
      console.log("Full Partner Response:", data);
      if (response.ok) {
        // Assuming the response contains the partner's data
        setchatPartner({
          name: data.friend_data.username,
          id: data.friend_data.userID,
          status: data.friend_data.status,
        });
      } else {
        console.warn("Fetch partner data failed:", data.error);
        if (data.error === "You can only view data of friends") {
          alert("You can only chat with users who are your friends.");}
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching friend data. Please try again.");
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get_messages",
          userID: userID,
          friend_id: friendID,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const transformed = data.messages.map((msg: any, index: number) => ({
          id: msg.id, // Assuming msg.id is already a number
          sender: msg.sender, // msg.sender should be a number, not a string
          recipient: msg.recipient, // msg.recipient should also be a number
          content: msg.content, // msg.content is the message body
          timestamp: msg.timestamp || new Date().toISOString(), // Use timestamp if available, else use current time
          is_read: msg.is_read !== undefined ? msg.is_read : false, // Default to false if not available
        }));
        setMessages(transformed);
        // Wait a moment to ensure FlatList has rendered
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100); // 100ms delay works well for most cases
      } else {
        console.warn("Fetch messages failed:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const sendMessage = async () => {
  
    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send_message",
          userID: userID,
          recipient_id: friendID,
          content: input,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setInput(""); // Clear the input after sending
        await fetchMessages(); // Fetch updated messages
      }else{
        console.warn("Send failed:", data.error);
      }
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={normalize(20)}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.chatPartnerInfo}>
          {/* <Image source={chatPartner.profilePic} style={styles.profilePic} /> */}
          <View style={styles.nameStatus}>
            <Text style={styles.partnerName}>
              {chatPartner?.name}{" "}
              <Text style={styles.partnerTag}>#{chatPartner?.id}</Text>
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: chatPartner?.status === "online" ? "#4CAF50" : "#888" },
                ]}
              />
              <Text style={styles.statusText}>
                {chatPartner?.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: normalize(20) }} />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          style={{flex:1}}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === userID ? styles.myMessage : styles.friendMessage,
              ]}
            >
              <Text style={styles.myMessageText}>{item.content}</Text>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => {
            console.log("Image button pressed");
          }}
        >
          <Image
            source={require("../../../assets/images/homeIcons/avatar.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          multiline
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingBottom: normalize(4),
    borderRadius: normalize(6),
    width: "100%",
  },
  header: {
    height: normalize(20), // increased height for profile
    backgroundColor: "#1e1e1e",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(6),
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    width: normalize(10),            // 10x10 circle
    height: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: "#0a84ff",      // blue circle
    justifyContent: "center",
    marginLeft: normalize(3),
    alignItems: "center",
  },
  backIcon: {
    color: "#fff",                   // white arrow
    fontSize: normalize(8),          // smaller font for 10x10 size
    fontWeight: "bold",
    lineHeight: normalize(8),
    textAlign: "center",
  },
  chatPartnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: normalize(8),
  },
  profilePic: {
    width: normalize(15),
    height: normalize(15),
    borderRadius: normalize(15),
    marginRight: normalize(4),
  },
  nameStatus: {
    justifyContent: "center",
  },
  partnerName: {
    color: "#eee",
    fontSize: normalize(6),
    fontWeight: "bold",
  },
  partnerTag: {
    color: "#999",
    fontWeight: "normal",
    fontSize: normalize(4),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: normalize(0.3),
  },
  statusDot: {
    width: normalize(2),
    height: normalize(2),
    borderRadius: normalize(3),
    marginRight: normalize(2),
  },
  statusText: {
    color: "#999",
    fontSize: normalize(4),
  },
  messageList: {
    flexGrow:1,
    paddingBottom: normalize(8),
    marginLeft: normalize(4),
    marginRight: normalize(4),
  },
  messageBubble: {
    maxWidth: "70%",
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    marginVertical: normalize(3),
  },
  myMessage: {
    backgroundColor: "#0a84ff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  friendMessage: {
    backgroundColor: "#2c2c2e",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  myMessageText: {
    color: "#fff",
    fontSize: normalize(4),
  },
  friendMessageText: {
    color: "#ccc",
    fontSize: normalize(5),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: normalize(2),
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: normalize(6),
  },
  imageButton: {
    width: normalize(15),
    height: normalize(15),
    justifyContent: "center",
    alignItems: "center",
    marginRight: normalize(6),
    marginLeft: normalize(4),
    borderRadius: normalize(6),
    backgroundColor: "#333",
  },
  imageIcon: {
    width: normalize(10),
    height: normalize(10),
    tintColor: "white",
  },
  input: {
    flex: 1,
    minHeight: normalize(5),
    maxHeight: normalize(20),
    fontSize: normalize(5),
    color: "#fff",
    backgroundColor: "#222",
    borderRadius: normalize(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(4),
  },
  sendButton: {
    marginLeft: normalize(5),
    backgroundColor: "#0a84ff",
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    marginRight: normalize(4),
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: normalize(4),
  },
});
