// Model objednavky
import Order from "../../models/order";

// Akcie spojene s objednavkou
export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

// Vyhladanie a nastavenie objednavok prihlaseneho uzivatela do redux store
export const fetchOrders = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      // Vyhladanie objednavok prihlaseneho uzivatela z firebase DB
      const response = await fetch(
        `https://reactnative-vamz-default-rtdb.firebaseio.com/orders/${userId}.json`
      );

      // Chyba pri procese nacitania
      if (!response.ok) {
        throw new Error("Something went wrong during fetching orders!");
      }
      // Nacitaj data z firebase
      const resData = await response.json();
      const loadedOrders = [];
      // Namapuj JSON objekt do pola
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].total,
            new Date(resData[key].date)
          )
        );
      }
      // Posli namapovane data na ulozenie do redux store
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (error) {
      throw error;
    }
  };
};
// Pridanie objednavky do DB a redux store
export const addOrder = (cartItems, total) => {
  // datum pridania objednavky
  const date = new Date();
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    
    // Ulozenie objednavky do DB firebase
    const response = await fetch(
      `https://reactnative-vamz-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          total,
          date: date.toISOString(),
        }),
      }
    );
    
    // Kontrola chyby pri pridavani do DB
    if (!response.ok) {
      throw new Error("Something went wrong during adding order!");
    }

    const resData = await response.json();
    // Ulozenie vytvorenej objednavky do Redux store
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        total: total,
        date: date,
      },
    });
  };
};
