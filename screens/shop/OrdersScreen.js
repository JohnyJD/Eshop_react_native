import React, { useEffect, useCallback, useState } from "react";
import {
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import OrderItem from "../../components/shop/OrderItem";
import * as ordersActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

// Komponent Reactu
// Vykresluje vsetky objednavky prihlaseneho uzivatela
// Obrazovka je dostupna len pre prihlasenych uzivatelov
const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  // Funkcia na nacitanie dat z DB
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    await dispatch(ordersActions.fetchOrders());
    setIsLoading(false);
  }, [dispatch, setIsLoading]);
  // Nacitanie dat 
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  // Ak sa data nacitavaju ukazuje indikator nacitania
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  // Ak uzivatel nema ziadne objednavky
  if(orders.length === 0) {
    return <View style={styles.centered}>
      <Text>No orders made yet</Text>
    </View>
  }
  // Zakladny komponent na vykreslenie
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          total={itemData.item.total}
          date={itemData.item.formatDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};
// Styly
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default OrdersScreen;
