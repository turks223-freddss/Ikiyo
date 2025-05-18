import React, { useState, useRef } from "react";
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
  userID: string;
};

type Message = {
  id: string;
  text: string;
  sender: "me" | "friend";
};

export default function ChatScreen({ onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! How are you?", sender: "friend" },
    { id: "2", text: "Hi! I'm good, thanks. And you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Chat partner info for header
  const chatPartner = {
    name: "Jane Doe",
    tag: "#1234",
    profilePic: require("../../../assets/images/homeIcons/avatar.png"),
    online: true,
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      text: input.trim(),
      sender: "me",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.friendMessage,
        ]}
      >
        <Text style={isMe ? styles.myMessageText : styles.friendMessageText}>
          {item.text}
        </Text>
      </View>
    );
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
          <Image source={chatPartner.profilePic} style={styles.profilePic} />
          <View style={styles.nameStatus}>
            <Text style={styles.partnerName}>
              {chatPartner.name}{" "}
              <Text style={styles.partnerTag}>{chatPartner.tag}</Text>
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: chatPartner.online ? "#4CAF50" : "#888" },
                ]}
              />
              <Text style={styles.statusText}>
                {chatPartner.online ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: normalize(20) }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

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
