import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
	ScrollView,
	View,
	Button,
	KeyboardAvoidingView,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "UPDATE";
// Zakladna funkcionalita pre Input fieldy Authentifikacie
authFormReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidies,
			[action.input]: action.isValid,
		};
		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			if (!updatedValidities[key]) {
				updatedFormIsValid = false;
			}
		}
		return {
			...state,
			inputValues: updatedValues,
			inputValidies: updatedValidities,
			formIsValid: updatedFormIsValid,
		};
	}
	return state;
};

// Komponent Reactu
// Obrazovka prihlasovania / registracie
const AuthScreen = (props) => {
	// Cakanie na odozvu DB
	const [isLoading, setIsLoading] = useState(false);
	// Log in alebo Sign up
	const [isSignUp, setIsSignUp] = useState(false);
	// Error pri prihlasovani/registrovani
	const [error, setError] = useState();

	const dispatch = useDispatch();
	// Ak je error tak ho vypise
	useEffect(() => {
		if (error) {
			Alert.alert("An error occured!", error, [{ text: "Ok" }]);
		}
	}, [error]);
	// Funkcia na spustenie prihlasovania / registrovania
	const authHandler = async () => {
		let action;
		if (isSignUp) {
			// Registracia
			//console.log("signing up");
			action = authActions.signUp(
				authState.inputValues.email,
				authState.inputValues.password
			);
		} else {
			// Prihlasovanie
			//console.log("logging in");
			action = authActions.logIn(
				authState.inputValues.email,
				authState.inputValues.password
			);
		}
		// Spustenie procesu (log in / sign up)
		setIsLoading(true);
		try {
			await dispatch(action);
			props.navigation.navigate("Products");
		} catch (error) {
			// Ak nastane chyba tak ju odchyti
			setError(error.message);
			setIsLoading(false);
		}
	};
	// Zakladny data Reducer pre komponent - Input data
	const [authState, dispatchAuthState] = useReducer(authFormReducer, {
		inputValues: {
			email: "",
			password: "",
		},
		inputValidies: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});
	// Zmena Input dat pre nejaky Input field
	// Ulozenie zmeny
	const inputChangeHandler = useCallback(
		(inputId, inputValue, inputValidity) => {
			dispatchAuthState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputId,
			});
		},
		[dispatchAuthState]
	);
	// Zakladny komponent
	return (
		<KeyboardAvoidingView
			behavior="padding"
			keyboardVerticalOffset={50}
			style={styles.screen}
		>
			<LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input
							id="email"
							label="Email"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Please enter valid email address."
							initialValue=""
							onInputChange={inputChangeHandler}
						/>
						<Input
							id="password"
							label="Password"
							keyboardType="default"
							secureTextEntry
							required
							minLength={5}
							autoCapitalize="none"
							errorText="Please enter valid password."
							initialValue=""
							onInputChange={inputChangeHandler}
						/>
						<View style={styles.buttons}>
							{isLoading ? (
								<ActivityIndicator size="small" color={Colors.primary} />
							) : (
								<Button
									title={isSignUp ? "Sign up" : "Log in"}
									color={Colors.primary}
									onPress={authHandler}
								/>
							)}
						</View>
						<View style={styles.buttons}>
							<Button
								title={`Switch to ${isSignUp ? "Log in" : "Sign up"}`}
								color={Colors.accent}
								onPress={() => {
									setIsSignUp((current) => !current);
								}}
							/>
						</View>
					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};
// Styly
const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	authContainer: {
		width: "80%",
		maxWidth: 400,
		maxHeight: 400,
		padding: 20,
	},
	buttons: {
		marginTop: 10,
	},
	gradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default AuthScreen;
