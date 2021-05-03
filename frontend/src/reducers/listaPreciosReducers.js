import {
    LISTA_PRECIO_LIST_FAIL,
    LISTA_PRECIO_LIST_SUCCESS,
    LISTA_PRECIO_LIST_REQUEST,
    LISTA_PRECIO_CREATE_REQUEST,
    LISTA_PRECIO_CREATE_SUCCESS,
    LISTA_PRECIO_CREATE_FAIL,
} from '../constants/listaPrecioConstants'

// Reducer para crear lista precio
export const listaPrecioCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case LISTA_PRECIO_CREATE_REQUEST:
            return { loading: true };
        case LISTA_PRECIO_CREATE_SUCCESS:
            return { loading: false, listaPrecio: action.payload };
        case LISTA_PRECIO_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}

// Reducer para listar precio
export const listaPrecioListReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case LISTA_PRECIO_LIST_REQUEST:
            return { loading: true };
        case LISTA_PRECIO_LIST_SUCCESS:
            return {
                loading: false,
                listaPrecio: action.payload,
            };
        case LISTA_PRECIO_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
