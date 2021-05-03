import Axios from "axios";
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    //CART_ADD_ITEM_FAIL,
} from "../constants/cartConstants";

export const addToCart = (productId, cantidad) => async (dispatch, getState) => {
    const { data } = await Axios.get(`/api/productos/${productId}`);
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            nombre: data.nombre,
            imagen: data.imagen,
            categoria: data.categoria,
            subcategoria: data.subcategoria,
            stock: data.stock,
            producto: data.cod_articulo,
            precio: data.precio,
            cantidad,
        },
    });
    localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems));
    //}

};

export const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: productId });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
};