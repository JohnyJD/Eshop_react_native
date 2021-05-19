import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import ProductsOverviewScreen from "../../screens/shop/ProductsOverviewScreen";
import ProductDetailsScreen from "../../screens/shop/ProductDetailsScreen";
import CartScreen from "../../screens/shop/CartScreen";

import defaultNavOptions from "./DefaultNavOption";

const ProductsStack = createStackNavigator();

// Navigator pre eshop - produkty, kosik
const ProductsNavigator = () => {
	return (
		<ProductsStack.Navigator
			screenOptions={() => defaultNavOptions()}
		>
			<ProductsStack.Screen
				name="Products"
				component={ProductsOverviewScreen}
				options={({ navigation }) => ({
					title: "Products",
					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={HeaderButton}>
							<Item
								title="Cart"
								iconName={Platform.OS === "anodroid" ? "md-cart" : "ios-cart"}
								onPress={() => {
									navigation.navigate("Cart");
								}}
							/>
						</HeaderButtons>
					),
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
			<ProductsStack.Screen
				name="ProductDetails"
				component={ProductDetailsScreen}
				options={({ navigation, route }) => ({
					title: route.params["productTitle"],
					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={HeaderButton}>
							<Item
								title="Cart"
								iconName={Platform.OS === "anodroid" ? "md-cart" : "ios-cart"}
								onPress={() => {
									navigation.navigate("Cart");
								}}
							/>
						</HeaderButtons>
					),
				})}
			/>
			<ProductsStack.Screen
				name="Cart"
				component={CartScreen}
				options={{ title: "Cart" }}
			/>
		</ProductsStack.Navigator>
	);
};

export default ProductsNavigator;