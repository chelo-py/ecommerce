import Axios from 'axios';
import {
    LISTA_PRECIO_LIST_REQUEST,
    LISTA_PRECIO_LIST_SUCCESS,
    LISTA_PRECIO_LIST_FAIL,
    LISTA_PRECIO_CREATE_REQUEST,
    LISTA_PRECIO_CREATE_SUCCESS,
    LISTA_PRECIO_CREATE_FAIL
} from '../constants/listaPrecioConstants'

//Acción para crear Lista de precios
const crearListaPrecio = (producto, referencia, descuento, precio) => async (dispatch, getState) => {
    dispatch({ type: LISTA_PRECIO_CREATE_REQUEST, payload: { producto, referencia, descuento, precio } })
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await Axios.post('/api/listaPrecio/crearlistaprecio',
            {
                producto,
                referencia,
                descuento,
                precio
            },
            {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }
        );
        dispatch({
            type: LISTA_PRECIO_CREATE_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: LISTA_PRECIO_CREATE_FAIL, payload: message });
    }
}

//Acción para listar Precios
export const listarPrecios = () => async (dispatch) => {
    dispatch({
        type: LISTA_PRECIO_LIST_REQUEST,
    });
    try {
        const { data } = await Axios.get(`/api/listaPrecio`);
        dispatch({ type: LISTA_PRECIO_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: LISTA_PRECIO_LIST_FAIL, payload: error.message });
    }
}

export default crearListaPrecio;