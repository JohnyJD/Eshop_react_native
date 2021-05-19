import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

import Card from "../UI/Card";

// Komponent Produktu - informacie o produkte - vyuziva Card
const ProductItem = (props) => {
  let TouchableComp = TouchableOpacity;
  // Rozne efekty pre IOS a Android ako Touch animacia
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableComp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: props.product.imageUrl }}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.product.title}</Text>
              <Text style={styles.price}>
                ${props.product.price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableComp>
      </View>
    </Card>
  );
};
// Styly
const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  touchable: {
      borderRadius: 10,
      overflow: 'hidden'
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "center",
    padding: 10,
    height: "15%",
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
    fontFamily: 'open-sans-bold'
  },
  price: {
    fontSize: 14,
    color: "#888",
    fontFamily: 'open-sans'
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
});

export default ProductItem;
