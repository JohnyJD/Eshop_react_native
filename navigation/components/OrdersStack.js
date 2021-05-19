import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import OrdersScreen from "../../screens/shop/OrdersScreen";

import defaultNavOptions from "./DefaultNavOption";

const OrdersStack = createStackNavigator();
// Navigator pre objednavky - iba pre prihlasenych uzivatelov
const OrdersNavigator = () => {
	return (
		<OrdersStack.Navigator
			screenOptions={() => defaultNavOptions()}
		>
			<OrdersStack.Screen
				name="Orders"
				component={OrdersScreen}
				options={({ navigation }) => ({
					title: "Orders",
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
		</OrdersStack.Navigator>
	);
};

export default OrdersNavigator;