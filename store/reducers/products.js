// Reducer pre produkty
import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from "../actions/products";

// Pociatocny stav pri spusteni aplikacie
const initialState = {
  allProducts: [],
  userProducts: []
};

// Metoda na manipulaciu s produktmi
export default (state = initialState, action) => {
  switch (action.type) {
    // Nastavenie produktov nacitanych z DB
    case SET_PRODUCTS:
      return {
        allProducts: action.products,
        userProducts: action.products.filter((prod) => prod.ownerId === action.userId)
      };
    // Vytvorenie produktu do redux store
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        allProducts: state.allProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    // Uprava uz vytvoreneho produktu
    case UPDATE_PRODUCT:
      // Najdenie id v produktoch uzivatela
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      // Najdenie id vo vsetkych produktoch 
      const allProductIndex = state.allProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      // Vytvorenie noveho produktu z novymi datami
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );
      // Nahradenie povodneho produktu novo vytvorenym
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;
      const updatedAllProducts = [...state.allProducts];
      updatedAllProducts[allProductIndex] = updatedProduct;
      return {
          ...state,
          allProducts: updatedAllProducts,
          userProducts: updatedUserProducts
      };
    // Vymazanie produktu z Redux store
    case DELETE_PRODUCT:
      // Filter na produkty - vrati iba produkty, ktore nechcem mazat
      // A vrati novy stav z vyfiltrovanych produktov
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        allProducts: state.allProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
