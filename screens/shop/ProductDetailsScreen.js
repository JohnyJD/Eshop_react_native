import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";

import Colors from "../../constants/Colors";

// Komponent Reactu
// Zobrazi detaily produktu na ktory uzivatel klikol z ProductsOverviewScreen
const ProductDetailsScreen = (props) => {
  // Ziskanie parametrov z navigatora o produkte
  const productId = props.route.params['productId'];
  // Nacitanie produktu z Redux store
  const product = useSelector((state) =>
    state.products.allProducts.find((item) => item.id === productId)
  );

  const dispatch = useDispatch();
  // Zakldany komponent na vykreslenie
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: product.imageUrl }} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title="Add to cart" onPress={() => {
          dispatch(cartActions.addToCart(product));
        }} />
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};
// Styly
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    fontFamily: 'open-sans-bold',
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: 'open-sans',
    marginHorizontal: 20
  },
});

export default ProductDetailsScreen;
