// Import pre ukladanie do uloziska v telefone
import AsyncStorage from "@react-native-async-storage/async-storage";

// Akcie pri authentikacii
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
// Timer pre auto-logout
let timer;

// Akcia pre log in a sign up
export const authenticate = (userId, token, expiryTime) => {
  //console.log("authentication");
  return (dispatch) => {
    // nastavi auto-logout timer
    dispatch(setLogoutTimer(expiryTime));
    // prihlasovanie/registracia
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

// Akcia pre registrovanie
export const signUp = (email, password) => {
  return async (dispatch) => {
    // Fetch do firebase na vytvorenie noveho pouzivatela 
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnmSxNUdfy8JXEAdgLlKE0A7bcrrvIssk",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    // Ak nie je nieco v poriadku, vyhodi chybovu hlasku s chybou
    if (!response.ok) {
      const errorResData = await response.json();
      
      const errorType = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorType === "EMAIL_EXISTS") {
        message = "This email is already taken!";
      }

      throw new Error(message);
    }
    // Ak je OK, tak prihlas pouzivatela
    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    // Nastav datum expiracie tokenu
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    // Uloz data o prihlasenom pouzivatelovi - auto-login
    saveDataToAsyncStorage(resData.idToken, resData.localId, expirationDate);
  };
};

// Akcia pre prihlasenie pouzivatela
export const logIn = (email, password) => {
  return async (dispatch) => {
    // Fetch do firebase DB na prihlasenie uzivatela
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnmSxNUdfy8JXEAdgLlKE0A7bcrrvIssk",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    // Ak zle udaje tak vypise chybu pri prihlasovani
    if (!response.ok) {
      const errorResData = await response.json();

      const errorType = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorType === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      }
      if (errorType === "INVALID_PASSWORD") {
        message = "Password is not valid!";
      }

      throw new Error(message);
    }
    // Prihlasenie uzivatela
    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    // Datum expiracie tokenu
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    // Ulozenie prihlaseneho uzivatela do uloziska telefonu pre auto-login
    saveDataToAsyncStorage(resData.idToken, resData.localId, expirationDate);
  };
};

// Akcia na odhlasenie uzivatela
export const logout = () => {
  console.log("logout");
  clearTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

// Vymaze casovac pre auto-logout
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};
// Nastavi casovac do kedy je token prihlaseneho uzivatela validny
const setLogoutTimer = (expirationDate) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationDate);
  };
};
// Ulozi data do uloziska v telefone pre auto-login
const saveDataToAsyncStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
