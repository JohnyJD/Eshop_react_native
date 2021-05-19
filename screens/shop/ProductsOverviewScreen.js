import React, { useEffect, useState, useCallback } from "react";
import {
	View,
	FlatList,
	Button,
	ActivityIndicator,
	StyleSheet,
	Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/Colors";

// Komponent Reactu
// Hlavna obrazovka
// Zobrazuje vsetky dostupne produkty eshopu
// Obrazovka je pristupna pre vsetkych
const ProductsOverviewScreen = (props) => {
	// Nacitavanie prvotne
	const [isLoading, setIsLoading] = useState(false);
	// Nacitavanie dat pri refreshi z DB
	const [isRefreshing, setIsRefreshing] = useState(false);
	// Error pri nacitavani
	const [error, setError] = useState();
	// Data o produktoch z Redux store
	const products = useSelector((state) => state.products.allProducts);
	const dispatch = useDispatch();
	// Nacitanie produktov z DB + ulozenie do Redux store
	const loadProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(productsActions.fetchProducts());
		} catch (error) {
			setError(error.message);
		}
		setIsRefreshing(false);
	}, [dispatch, setError, setIsLoading]);
	// Ak sa opat vrati uzivatel na tuto obrazovku
	// Nastavi listener pre navigator
	// AK sa vrati opat tak spusti proces nacitania produktov z DB
	useEffect(() => {
		const willFocusFn = props.navigation.addListener("focus", loadProducts);
		return willFocusFn;
	}, [loadProducts]);
	// Prvotne nacitanie dat
	useEffect(() => {
		setIsLoading(true);
		loadProducts().then(() => {
			setIsLoading(false);
		});
	}, [dispatch, loadProducts]);
	// Akcia spojena pre prejdenie na detail produktu
	const selectItemHandler = (prodId, prodTitle) => {
		// Navigovanie na obrazovku detailu produktu
		// Nastavenie props produktu
		props.navigation.navigate("ProductDetails", {
			productId: prodId,
			productTitle: prodTitle,
		});
	};
  // Ak nastane error tak ho vypise a vykresli tlacidlo na opatovne spustenie nacitania dat
	if (error) {
		return (
			<View style={styles.centered}>
				<Text>{error}</Text>
				<Button
					title="Try again"
					onPress={loadProducts}
					color={Colors.primary}
				/>
			</View>
		);
	}
  // Ak Prvotne nacitavanie dat tak zobrazi indikator nacitania
	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
  // Ak nenacita ziadne data
	if (!isLoading && products.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>No products found</Text>
			</View>
		);
	}
  // Zakladny komponent na vykreslenie
	return (
		<FlatList
			onRefresh={loadProducts}
			refreshing={isRefreshing}
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					product={itemData.item}
					onSelect={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}
				>
					<Button
						color={Colors.primary}
						title={"View Details"}
						onPress={() => {
							selectItemHandler(itemData.item.id, itemData.item.title);
						}}
					/>
					<Button
						color={Colors.primary}
						title={"To cart"}
						onPress={() => {
							dispatch(cartActions.addToCart(itemData.item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

/*ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "anodroid" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "anodroid" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};*/

export default ProductsOverviewScreen;
