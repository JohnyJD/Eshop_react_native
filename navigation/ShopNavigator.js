import React from "react";
import { Button, View } from "react-native";
import { useDispatch } from "react-redux";

import {
	createDrawerNavigator,
	DrawerItemList,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// Nacitacia obrazovka
import StartUpScreen from "../screens/StartUpScreen";

// Stack navigatory pre aplikaciu
import ProductsNavigator from "./components/ProductsStack";
import AuthNavigator from "./components/AuthStack";
import UsersNavigator from "./components/UsersStack";
import OrdersNavigator from "./components/OrdersStack";

// Zakladne farby aplikacie
import Colors from "../constants/Colors";
// Akcie spojene s authetifikaciou
import * as authActions from "../store/actions/auth";

const Drawer = createDrawerNavigator();

// Tlacidlo pre odhlasenie uzivatela
const LogOutButton = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector((state) => !!state.auth.token);
	return (
		<View>
			{isAuth ? (
				<Button
					title="Log out"
					color={Colors.primary}
					onPress={() => {
						dispatch(authActions.logout());
					}}
				/>
			) : (
				<></>
			)}
		</View>
	);
};
// Hlavny Drawer navigator pre celu aplikaciu
const ShopNavigation = () => {
	// Zistenie ci je uzivatel prihlaseny
	const isAuth = useSelector((state) => !!state.auth.token);
	// Zistenie ci bola start up obrazovka ukoncena , resp. ci sa nacitala apka
	const appLoaded = useSelector((state) => state.appLoading.loaded);
	return (
		<Drawer.Navigator
			drawerContentOptions={{
				activeTintColor: Colors.primary,
			}}
			drawerContent={(props) => (
				<DrawerContentScrollView {...props}>
					<DrawerItemList {...props} />
					<LogOutButton {...props} />
				</DrawerContentScrollView>
			)}
		>
			{!appLoaded ? (
				<Drawer.Screen
					name="Start up"
					component={StartUpScreen}
					options={() => ({
						drawerLabel: () => null,
						title: undefined,
						drawerIcon: () => null,
					})}
				/>
			) : (
				<></>
			)}
			<Drawer.Screen
				name="Products"
				component={ProductsNavigator}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
							size={23}
							color={color}
						/>
					),
				}}
			/>
			{isAuth ? (
				<>
					<Drawer.Screen
						name="Orders"
						component={OrdersNavigator}
						options={{
							drawerIcon: ({ color }) => (
								<Ionicons
									name={Platform.OS === "android" ? "md-list" : "ios-list"}
									size={23}
									color={color}
								/>
							),
						}}
					/>
					<Drawer.Screen
						name="Admin"
						component={UsersNavigator}
						options={{
							drawerIcon: ({ color }) => (
								<Ionicons
									name={
										Platform.OS === "android" ? "md-construct" : "ios-construct"
									}
									size={23}
									color={color}
								/>
							),
						}}
					/>
				</>
			) : (
				<Drawer.Screen
					name="Auth"
					component={AuthNavigator}
					options={{
						drawerLabel: "Log in",
						drawerIcon: ({ color }) => (
							<Ionicons
								name={Platform.OS === "android" ? "md-person" : "ios-person"}
								size={23}
								color={color}
							/>
						),
					}}
				/>
			)}
		</Drawer.Navigator>
	);
};

export default ShopNavigation;
