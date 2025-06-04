import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    left: "4%",
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 50,
    width: "30%",
    alignSelf: "center",
    position: "absolute",
    top: "5%",
},
username: {
    fontSize: 22,
    fontWeight: "bold",
},
userId: {
    fontSize: 14,
    color: "gray",
},
iconMargin: {
    marginRight: 15,
},
statusContainer: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 20,
    width: "15%",
    alignSelf: "center",
    position: "absolute",
    top: "5%",
    right: 18,
    alignItems: "flex-start",
},
statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
},
statusText: {
    fontSize: 20,
    fontWeight: "bold",
},
mapButton: {
    position: "absolute",
    bottom: "30%",
    left: "13%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
},
avatarButton: {
    position: "absolute",
    bottom: "16%",
    right: "13%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
},
editButton: {
    position: "absolute",
    bottom: "7%",
    right: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
},
});

export default styles;
