import { StyleSheet } from "react-native";
import { normalize } from "../../../../assets/normalize";

// Helper to scale down normalized values by a third
const n = (value: number) => normalize(value / 3.5);

const styles = StyleSheet.create({
overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
},
popup: {
    width: n(320),
    backgroundColor: "#FFD2B3",
    borderRadius: n(18),
    borderWidth: n(5),
    borderColor: "#7A6B63",
    alignItems: "center",
    paddingVertical: n(32),
    paddingHorizontal: n(18),
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: n(12),
    elevation: 10,
},
headerText: {
    fontSize: n(32),
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#7A6B63",
    textShadowOffset: { width: n(2), height: n(2) },
    textShadowRadius: n(2),
    marginBottom: n(18),
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "sans-serif",
},
rewardBox: {
    width: n(270),
    height: n(120),
    backgroundColor: "#F9CBA7",
    borderRadius: n(14),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: n(28),
    alignSelf: "center",
},
coinGlow: {
    width: n(70),
    height: n(70),
    borderRadius: n(35),
    backgroundColor: "#fffbe7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fffbe7",
    shadowOpacity: 1,
    shadowRadius: n(18),
    marginBottom: n(4),
},
coin: {
    width: n(54),
    height: n(54),
},
amount: {
    color: "#7A6B63",
    fontSize: n(28),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: n(2),
    textShadowColor: "#fff",
    textShadowOffset: { width: n(1), height: n(1) },
    textShadowRadius: n(1),
},
claimButton: {
    width: n(210),
    height: n(54),
    backgroundColor: "#4DD16E",
    borderRadius: n(12),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: n(4),
    borderColor: "#2B8C3E",
    shadowColor: "#2B8C3E",
    shadowOpacity: 0.18,
    shadowRadius: n(6),
    elevation: 4,
},
claimButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: n(28),
    letterSpacing: 1,
    textShadowColor: "#7A6B63",
    textShadowOffset: { width: n(2), height: n(2) },
    textShadowRadius: n(1),
},
});

export default styles;