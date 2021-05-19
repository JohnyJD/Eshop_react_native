import React, {useState} from "react";
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";

// Komponent Reactu
// Vykreslenie veci v kosiku a informacii o kosiku
// Je dostupny pre vsetkych
// Ale objednat si moze len prihlaseny uzivatel
const CartScreen = (props) => {
  // Nacitavanie pocas vytvarania objednavky
  const [isLoading, setIsLoading] = useState(false);
  // Zistenie ci je uzivatel prihlaseny
  const isAuth = useSelector(state => !!state.auth.token);
  // Nacitanie dat z kosika z Redux store
  const cartTotal = useSelector((state) => state.cart.total);
  const cartItems = useSelector((state) => {
    // Namapovanie dat z objektu do pola
    const toArrayCartItems = [];
    for (const key in state.cart.items) {
      toArrayCartItems.push({
        productId: key,
        productPrice: state.cart.items[key].productPrice,
        productTitle: state.cart.items[key].productTitle,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    // Usporiadanie dat podla ID
    return toArrayCartItems.sort((a, b) => {
      return a.productId > b.productId ? 1 : -1;
    });
  });

  const dispatch = useDispatch();
  // Pridanie objednavky
  const addOrderHandler = async () => {
    setIsLoading(true);
    if(isAuth) {
      // Uzivatel je prihlaseny
      await dispatch(ordersActions.addOrder(cartItems, cartTotal));
    } else {
      // Uzivatel sa musi prihlasit
      props.navigation.navigate("Auth");
    }
    setIsLoading(false);
  }
  // Zakladny komponent na vykreslenie
  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.amount}>${cartTotal.toFixed(2)}</Text>
        </Text>
        {isLoading ? 
          <ActivityIndicator size="small" color={Colors.primary}/> :
          <Button
            color={Colors.primary}
            title="Order now"
            disabled={cartItems.length === 0}
            onPress={addOrderHandler}
          />
        }
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            item={itemData.item}
            inCartScreen={true}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};
// Styly
const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 20,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
