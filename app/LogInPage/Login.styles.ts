import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../assets/normalize";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: width,
    height: height,
    zIndex: -1,
},
centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2%",
},
container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
signboard: {
    width: normalize(350),
    height: normalize(250),
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
},
title: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(2),
    color: "#4a2f1b",
    textAlign: "center",
    fontFamily: "serif",
},
input: {
    width: "65%",
    height: normalize(20),
    borderColor: "#7c5a3a",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: normalize(4),
    backgroundColor: "#fff8f0",
    color: "#3e2a1e",
    fontSize: normalize(8),
},
buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
},
button: {
    flex: 1,
    backgroundColor: "#a86e3b",
    paddingVertical: normalize(4),
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 2,
},
buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: normalize(6),
    fontFamily: "serif",
},
secondaryButton: {
    backgroundColor: "#fff8f0",
    borderWidth: 1,
    borderColor: "#a86e3b",
},
secondaryButtonText: {
    color: "#a86e3b",
},
arrange: {
    width: "100%",
    alignItems: "center",
    marginBottom: normalize(7),
},
});

export default styles;