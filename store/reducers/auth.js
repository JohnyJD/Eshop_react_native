// Akcie authentifikacie
import { AUTHENTICATE, LOGOUT } from "../actions/auth"

// Pocatocny stav
const initialState = {
    token: null,
    userId: null
}

// Reducer pre Auth
export default (state = initialState, action) => {
    switch(action.type) {
        // Authentifikacia - ulozenie uzivatela (prihlaseny/registrovany)
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId
            };
        // Odhlasenie uzivatela
        case LOGOUT:
            return initialState;
        default: 
            return state;
    }
}