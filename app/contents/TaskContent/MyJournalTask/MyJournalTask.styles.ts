import { StyleSheet, Dimensions, PixelRatio } from "react-native";
import { normalize } from "@/assets/normalize";
const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
    flex: 1,
    width: '100%',
    paddingTop: height * 0.03,
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.03,
    justifyContent: 'flex-start',
    },
    title: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: height * 0.01,
    textTransform: 'uppercase',
    },
    content: {
    flex: 1,
    flexDirection: 'row',
    gap: normalize(8),
    },
    contentColumn: {
    flexDirection: 'column',
    },
    leftColumn: {
    width: '40%',
    paddingRight: normalize(4),
    },
    rightColumn: {
    width: '60%',
    paddingLeft: normalize(4),
    backgroundColor: 'white',
    },
    fullWidth: {
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    },
    taskList: {
    paddingBottom: normalize(10),
    },
    centeredOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.10)",
    },
    noBuddyBox: {
    backgroundColor: "#FFD2B3",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7A6B63",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 270,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    },
    noBuddyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#7A6B63",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "sans-serif",
    },
    noBuddySubtitle: {
    fontSize: 15,
    color: "#7A6B63",
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "500",
    },
    noBuddyButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    },
    noBuddyCancel: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7A6B63",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    },
    noBuddyCancelText: {
    color: "#7A6B63",
    fontWeight: "bold",
    fontSize: 16,
    },
    noBuddyConfirm: {
    flex: 1,
    backgroundColor: "#4DD16E",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2B8C3E",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    },
    noBuddyConfirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
},
});

export default styles;