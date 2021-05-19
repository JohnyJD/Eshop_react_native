// Akcie Kosika
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";

// Pridanie produktu do kosika
export const addToCart = (product) => {
  return { type: ADD_TO_CART, product: product };
};

// Vymazanie produktu z kosika
export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, pid: productId };
};
