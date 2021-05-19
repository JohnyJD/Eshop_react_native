import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import ShopNavigator from "./ShopNavigator";

// Obalova fukcia pre navigaciu aplikacie 
const MainNavigationContainer = (props) => {
  const isAuth = useSelector((state) => state.auth.token != null ? true : false);
  const navRef = useRef();
  useEffect(() => {
    if (!isAuth) {
      navRef.current.navigate("Auth");
    }
  }, [isAuth]);

  return (
    <NavigationContainer ref={navRef}>
      <ShopNavigator />
    </NavigationContainer>
  );
};

export default MainNavigationContainer;
