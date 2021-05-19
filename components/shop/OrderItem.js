import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import Card from '../UI/Card';

// Komponent pre Objednavku - informacie o objednavke - vyuziva Card
const OrderItem = (props) => {
  // Drop down state - pre aktivovanie zobrazenia detailov objednavky
  const [showDetails, setShowDetails] = useState(false);
  // Komponent Objednavky
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.total}>${props.total.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetails ? "Hide details" : "Show details"}
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}
      />
      {showDetails && (
        <View style={styles.details}>
          {props.items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              item={cartItem}
              inCartScreen={false}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  total: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#888",
  },
  details: {
    width: "100%",
  },
});

export default OrderItem;
