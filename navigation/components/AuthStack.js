import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import AuthScreen from "../../screens/user/AuthScreen";

import defaultNavOptions from "./DefaultNavOption";

const AuthStack = createStackNavigator();

// Navigator pre prihlasenie/registrovanie a odhlasenie uzivatelov
const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
			screenOptions={({ navigation }) => defaultNavOptions(navigation)}
		>
			<AuthStack.Screen
				name="Authentication"
				component={AuthScreen}
				options={({ navigation }) => ({
					title: "Authenticate",
					headerLeft: () => (
						<HeaderButtons HeaderButtonComponent={HeaderButton}>
							<Item
								title="Menu"
								iconName={Platform.OS === "anodroid" ? "md-menu" : "ios-menu"}
								onPress={() => {
									navigation.toggleDrawer();
								}}
							/>
						</HeaderButtons>
					),
				})}
			/>
		</AuthStack.Navigator>
	);
};

export default AuthNavigator;