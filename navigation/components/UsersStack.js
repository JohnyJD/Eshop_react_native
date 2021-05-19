import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import UserProductsScreen from "../../screens/user/UserProductsScreen";
import EditProductsScreen from "../../screens/user/EditProductScreen";

import defaultNavOptions from "./DefaultNavOption";

const UsersStack = createStackNavigator();

// Navigator pre pouzivatela - Admin
const UsersNavigator = () => {
	return (
		<UsersStack.Navigator
			screenOptions={({ navigation }) => defaultNavOptions(navigation)}
		>
			<UsersStack.Screen
				name="Your products"
				component={UserProductsScreen}
				options={({ navigation }) => ({
					title: "User products",
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
					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={HeaderButton}>
							<Item
								title="Add"
								iconName={
									Platform.OS === "anodroid" ? "md-create" : "ios-create"
								}
								onPress={() => {
									navigation.navigate("EditProduct");
								}}
							/>
						</HeaderButtons>
					),
				})}
			/>
			<UsersStack.Screen
				name="EditProduct"
				component={EditProductsScreen}
				options={({ route }) => ({
					title:
						route.params && route.params.productId
							? "Editing product"
							: "Adding product",
				})}
			/>
		</UsersStack.Navigator>
	);
};

export default UsersNavigator;