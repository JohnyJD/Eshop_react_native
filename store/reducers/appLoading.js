import { LOADED } from "../actions/appLoading";
// Pociatocny stav 
const initialState = {
	loaded: false,
};
// Reducer na ulozenie nacitanie aplikacie do Redux store
const appLoadingReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOADED:
			return {
				loaded: true,
			};
		default:
			return state;
	}
};

export default appLoadingReducer;
