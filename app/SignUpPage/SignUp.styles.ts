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
    marginTop: "8%",
},
container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
signboard: {
    width: normalize(250),
    height: normalize(400),
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
},
title: {
    fontSize: normalize(10),
    fontWeight: "bold",
    color: "#4a2f1b",
    textAlign: "center",
    fontFamily: "serif",
    marginBottom: normalize(1),
},
inputcontainer:{
    width: "55%",
    height: normalize(15),
    marginBottom: normalize(4),
},
sauron:{
    position: "absolute", 
    right: 10, 
    top: 0, 
    height: "100%", 
    justifyContent: "center" 
},
input: {
    width: "55%",
    height: normalize(15),
    borderColor: "#7c5a3a",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: normalize(4),
    backgroundColor: "#fff8f0",
    color: "#3e2a1e",
    fontSize: normalize(6),
},
passwordinput: {
    width: "100%",
    height: normalize(15),
    borderColor: "#7c5a3a",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: normalize(4),
    backgroundColor: "#fff8f0",
    color: "#3e2a1e",
    fontSize: normalize(6),
},

buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
    marginTop: normalize(2),
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
    marginBottom: normalize(28),
},
});

export default styles;
