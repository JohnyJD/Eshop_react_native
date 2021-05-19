import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from "../../models/cart-item";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

// Pociatocny stav
const initialState = {
  items: {},
  total: 0,
};
// Reducer pre Kosik
export default (state = initialState, action) => {
  switch (action.type) {
    // Pridanie do kosika
    case ADD_TO_CART:
      const prod = action.product;
      const prodPrice = prod.price;
      const prodTitle = prod.title;

      let cartItem;

      if (state.items[prod.id]) {
        // Produkt sa uz nachadza v kosiku
        cartItem = new CartItem(
          state.items[prod.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[prod.id].sum + prodPrice
        );
      } else {
        // Pridat novy produkt do kosika
        cartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      // Novo vytvoreny stav
      return {
        ...state,
        items: { ...state.items, [prod.id]: cartItem }, // [prod.id] -> novy kluc ktoremu bude prideleny newCartItem
        total: state.total + prodPrice,
      };
    // Vymazanie produktu z kosika
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid];
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        // Znizit pocet
        const updateCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updateCartItem };
      } else {
        // Vymazat uplne produkt z kosika
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      // Novo vytvoreny stav
      return {
        ...state,
        items: updatedCartItems,
        total: updatedCartItems
          ? state.total - selectedCartItem.productPrice
          : 0,
      };
    // Odchytenie vytvarania objednavky na vynulovanie kosika
    case ADD_ORDER:
      return initialState;
    // Odchytenie mazania produktu
    case DELETE_PRODUCT:
      // Ak kosik neobsahuje mazany produkt
      if (!state.items[action.pid]) {
        return state;
      }
      // Ak obsahuje mazany produkt tak ho vymaze z kosika 
      const updatedItems = { ...state.items };
      const itemTotal = updatedItems[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        total: state.total - itemTotal,
      };
  }
  return state;
};
