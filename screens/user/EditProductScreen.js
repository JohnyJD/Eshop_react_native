import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as productActions from "../../store/actions/products";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";


import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

const FORM_INPUT_UPDATE = "UPDATE";
// React reducer - data o produkte na update alebo create
// Ak produkt update - nacita data o produkte a ulozi do reducera
// Ak produkt create - nenacita nic , polia su prazdne
formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidies,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      if (!updatedValidities[key]) {
        updatedFormIsValid = false;
      }
    }
    return {
      ...state,
      inputValues: updatedValues,
      inputValidies: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }
  return state;
};

// Komponent Reactu
// Vykresluje konkretny produkt, ktory chce uzivatel zmenit alebo pripadne vytvorit novy
const EditProductsScreen = (props) => {
  // Spustenie cakania pri ukladani
  const [isLoading, setIsLoading] = useState(false);
  // Errory pri ukladani
  const [error, setError] = useState();

  // Vybranie ID produktu z parametrov navigatora
  const prodId =
    props.route.params && props.route.params["productId"]
      ? props.route.params["productId"]
      : undefined;
  // Najdenie produktu podla ID - ak ID nie je tak uzivatel ide vytvarat novy produkt
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  const dispatch = useDispatch();
  // Zakladne data o produkte pre Inputy
  // Ak produkt nie je tak Inputy su prazdne, inac nacita data z produktu
  // Zaroven si udrziava aj stav o validite Inputov a samotneho formulara
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidies: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  // Ak sa vyskitne chyba tak ju komponent vypise
  useEffect(() => {
    if(error) {
      Alert.alert("An error occured!", error, [{text: "OK"}]);
    }
  }, [error]);
  // Ukladanie produktu do DB a Redux store
  const saveProduct = useCallback(async () => {
    // Ak formular nie je validny tak vypise chybu
    if (!formState.formIsValid) {
      Alert.alert("Wrong input", "Check errors in the form please!", [
        { text: "OK" },
      ]);
      return;
    }
    // Nastavenie cakania + vynulovanie errorov
    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        // Update produktu
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description
          )
        );
      } else {
        // Vytvarenie noveho produktu
        await dispatch(
          productActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            +formState.inputValues.price,
            formState.inputValues.description
          )
        );
      }
      // Ak bez chyby tak navigavat spat
      props.navigation.goBack();
    } catch (error) {
      // Nastavenie chyby
      setError(error.message);
    }
    // Koniec cakania
    setIsLoading(false);
    
  }, [dispatch, prodId, formState, setIsLoading, setError]);

  useEffect(() => {
    // Nastavenie nastaveni navigatora
    // Pridelenie tlacidla , ktore spusta update/create produktu
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "anodroid" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={saveProduct}
          />
        </HeaderButtons>
      )
    });
  }, [saveProduct]);

  // Zmena Input dat pre nejaky Input field
  // Ulozenie zmeny
  const inputChangeHandler = useCallback(
    (inputId, inputValue, inputValidity) => {
      //console.log("input has changed : " + inputId, inputValue, inputValidity);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchFormState]
  );
  // Ak caka na ulozenie alebo update produktu
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  // Hlavny komponent na nacitanie
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Enter valid title!"
            onInputChange={inputChangeHandler}
            initValue={editedProduct ? editedProduct.title : ""}
            initValidity={editedProduct ? true : false}
            required
            returnKeyType="next"
          />
          <Input
            id="imageUrl"
            label="Image URL"
            errorText="Enter valid image url!"
            onInputChange={inputChangeHandler}
            initValue={editedProduct ? editedProduct.imageUrl : ""}
            initValidity={editedProduct ? true : false}
            required
            returnKeyType="next"
          />
          {!editedProduct && (
            <Input
              id="price"
              label="Price"
              errorText="Enter valid price!"
              onInputChange={inputChangeHandler}
              initValue={editedProduct ? editedProduct.price : ""}
              initValidity={editedProduct ? true : false}
              required
              min={0.1}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Enter valid description!"
            onInputChange={inputChangeHandler}
            initValue={editedProduct ? editedProduct.description : ""}
            initValidity={editedProduct ? true : false}
            required
            minLength={10}
            returnKeyType="next"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styly
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    margin: 20,
  },
});

export default EditProductsScreen;
