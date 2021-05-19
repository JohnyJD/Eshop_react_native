import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
// Reducer dat Reactu pre ulozenie dat z inputu do Reducera
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};
// Zakladny React komponent
const Input = (props) => {
  // Zakladne data pre Input
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initValue ? props.initValue : "",
    isValid: props.initValidity,
    touched: false,
  });

  const { onInputChange, id } = props;
  // Ak sa uzivatel klikne na input tak nastavi touched a data
  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);
  // Zakladna validacia dat
  const textChangedHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    // Ak su data required
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    // Ak email
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    // Min hodnota
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    // Max hodnota
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    // Min dlzka
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    // Po validacii uloz data do Inputu
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };
  // Pri strateni focusu nastavi touched na True
  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };
  // Hlavny komponent React - Input
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangedHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};
// Styly Inputu
const styles = StyleSheet.create({
  inputWrap: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default Input;
