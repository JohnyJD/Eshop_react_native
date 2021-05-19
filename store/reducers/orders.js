import Order from "../../models/order";
import { ADD_ORDER, SET_ORDERS } from "../actions/orders";

// Pociatocny stav
const initialState = {
  orders: [],
  total: 0,
};

// Reducer pre Objednavky
export default (state = initialState, action) => {
  switch (action.type) {
    // Nastavenie objednavok prihlaseneho uzivatela
    case SET_ORDERS:
      return {
        orders: action.orders,
      };
    // Pridanie objednavky z DB
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.total,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder), // prida novy order a vrati novy array
      };
  }
  return state;
};
