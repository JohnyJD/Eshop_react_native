import {Platform} from "react-native";
import Colors from "../../constants/Colors";

// Zakladne nastavenia pre navigatory
const defaultNavOptions = () => {
	return {
		headerStyle: {
			backgroundColor: Platform.OS === "android" ? Colors.primary : "",
		},
		headerTitleStyle: {
			fontFamily: "open-sans-bold",
		},
		headerBackTitleStyle: {
			fontFamily: "open-sans",
		},
		headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
	};
};

export default defaultNavOptions;