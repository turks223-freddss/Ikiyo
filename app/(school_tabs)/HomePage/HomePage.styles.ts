// app/styles/HomeScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "../../../assets/normalize";

const { width, height } = Dimensions.get("window");

const HomeStyles = StyleSheet.create({
main:{
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
},
container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: normalize(2),
    paddingTop: normalize(4),
},
room: {
    position: 'absolute',
    height: "100%",
    width: "100%",
    bottom: 0,
    flex: 1,
},
profileCardContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    width: "100%",
    paddingHorizontal: normalize(10), 
    marginTop: normalize(4),
},
bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: normalize(4),
    marginTop: "auto",
    width: "100%",
    paddingRight: normalize(12),
},
bottomButtons: {
    flexDirection: "row",
    gap: normalize(5),
},
buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
},
overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
},
overlayWindow: {
    width: "80%",
    height: "90%",
    backgroundColor: "rgba(255, 201, 172, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
},
closeButton: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
},
currencyIcon:{
    width: normalize(15), 
    height:normalize(15), 
},
});

export default HomeStyles;
