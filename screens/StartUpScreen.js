import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";
import * as appLoadingActions from "../store/actions/appLoading";

// Nacitavacia obrazovka
// - Pouzita pri spusteni aplikacie
// - Iba komponent na nacitanie prihlaseneho usera - auto-login - ak je token validny
const StartUpScreen = (props) => {
	const dispatch = useDispatch();
	// Ulozenie usera a presmerovanie ak je prihlaseny
	useEffect(() => {
		//console.log("inside of start up");
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem("userData");
			// Ak user nie je ulozeny
			if (!userData) {
				props.navigation.navigate("Products");
				dispatch(appLoadingActions.loaded());
				return;
			}
			const userDataToJson = JSON.parse(userData);
			const { token, userId, expiryDate } = userDataToJson;

			const expirationDate = new Date(expiryDate);
			// Ak user nema validny token
			if (expirationDate <= new Date() || !token || !userId) {
				props.navigation.navigate("Products");
				dispatch(appLoadingActions.loaded());
				return;
			}
			// Ak user ma platny token - je prihlaseny
			const expirationTime = expirationDate.getTime() - new Date().getTime();

			props.navigation.navigate("Products");
			dispatch(authActions.authenticate(userId, token, expirationTime));
			dispatch(appLoadingActions.loaded());
		};

		tryLogin();

	}, [dispatch]);
	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default StartUpScreen;
