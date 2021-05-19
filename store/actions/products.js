// Produkt model
import Product from "../../models/product";

// Akcie spojene s produktom
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

// Nacitanie produktov z DB firebase
export const fetchProducts = () => {
	return async (dispatch, getState) => {
		//console.log("Fetching products");
		try {
			const userId = getState().auth.userId;
			// Nacitanie dat z DB
			const response = await fetch(
				"https://reactnative-vamz-default-rtdb.firebaseio.com/products.json"
			);
			// Kontrola chyby z DB
			if (!response.ok) {
				throw new Error("Something went wrong during fetching products!");
			}
			// Nacitane produkty z DB
			const resData = await response.json();
			const loadedProds = [];
			// Namapovanie produktov z JSON objektu do Array
			for (const key in resData) {
				loadedProds.push(
					new Product(
						key,
						resData[key].ownerId,
						resData[key].title,
						resData[key].imageUrl,
						resData[key].description,
						resData[key].price
					)
				);
			}
			// Nastavenie nacitanych produktov do Redux store
			dispatch({ type: SET_PRODUCTS, products: loadedProds, userId: userId });
		} catch (error) {
			throw error;
		}
	};
};
// Vymazanie produktu
export const deleteProduct = (productId) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		// Vymazanie produktu z DB
		await fetch(
			`https://reactnative-vamz-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
			{
				method: "DELETE",
			}
		);
		// Vymazanie produktu z Redzx store
		dispatch({ type: DELETE_PRODUCT, pid: productId });
	};
};

// Vytvorenie noveho produktu
export const createProduct = (title, imageUrl, price, description) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;
		// Vytvorenie produktu v DB firebase
		const response = await fetch(
			`https://reactnative-vamz-default-rtdb.firebaseio.com/products.json?auth=${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					imageUrl,
					description,
					price,
					ownerId: userId,
				}),
			}
		);
		// Kontorla chyby
		if (!response.ok) {
			throw new Error("Something went wrong during adding product!");
		}
		// Nacitanie novo vytvoreneho produktu z DB
		const resData = await response.json();
		// Vytvorenie produktu do Redux store
		dispatch({
			type: CREATE_PRODUCT,
			productData: {
				id: resData.name,
				title,
				imageUrl,
				price,
				description,
				ownerId: userId,
			},
		});
	};
};

// Upravenie vytvoreneho produktu
export const updateProduct = (id, title, imageUrl, description) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		// Upravenie daneho produktu v DB firebase
		const response = await fetch(
			`https://reactnative-vamz-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					imageUrl,
					description,
				}),
			}
		);
		// Kontrola chyby
		if (!response.ok) {
			throw new Error("Something went wrong during updating product!");
		}
		// Uprava produktu v Redux store
		dispatch({
			type: UPDATE_PRODUCT,
			pid: id,
			productData: {
				title,
				imageUrl,
				description,
			},
		});
	};
};
