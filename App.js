import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";

// Debugovanie redux store
import { composeWithDevTools } from "redux-devtools-extension";

// nacitanie ulozenych fontov do aplikacie
const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};
// Redux store reducers - obsahuje data o produktoch, kosiku, objednavkach, prihlaseneho uzivatela
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import appLoadingReducer from "./store/reducers/appLoading";

// Spojenie reducerov do redux store
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
  appLoading: appLoadingReducer
});

// Inicializacia redux store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); // Pri produkcnej verzii composeWithDevTools() vymazat - je to iba na debug redux store

// Hlavny navigator aplikacie
import MainNavigation from "./navigation/NavigationContainer";

// Hlavna funkcia aplikacie
export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  // Pri nacitavani fontov je aplikacia v stave nacitavania
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }
  // Hlavna cast aplikacie - po nacitani fontov
  return (
    <Provider store={store}>
      <MainNavigation />
    </Provider>
  );
}
