import React from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import * as productsActions from "../../store/actions/products";


// Komponent Reactu
// Vykresluje vsetky produkty, ktore vytvoril prihlaseny uzivatel
// Tuto obrazovku vie navstivit iba prihlaseny uzivatel
const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispath = useDispatch();

  const editProductHandler = (id) => {
    props.navigation.navigate("EditProduct", {
      productId: id,
    });
  };

  const deleteHandler = (prodId) => {
    Alert.alert("Are you suer ?", "Do you really wisht to delete this item ?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispath(productsActions.deleteProduct(prodId));
        },
      },
    ]);
  };

  if(userProducts.length === 0) {
    return <View style={styles.centered}>
      <Text>No products found</Text>
    </View>
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          product={itemData.item}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
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
    alignItems: "center"
  }
});

export default UserProductsScreen;
