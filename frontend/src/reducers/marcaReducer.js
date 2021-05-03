import {
    MARCA_CREATE_FAIL,
    MARCA_CREATE_REQUEST,
    MARCA_CREATE_SUCCESS,
    MARCA_DETAILS_FAIL,
    MARCA_DETAILS_REQUEST,
    MARCA_DETAILS_RESET,
    MARCA_DETAILS_SUCCESS,
    MARCA_LIST_FAIL,
    MARCA_LIST_REQUEST,
    MARCA_LIST_SUCCESS,
    MARCA_REVIEW_CREATE_FAIL,
    MARCA_REVIEW_CREATE_REQUEST,
    MARCA_REVIEW_CREATE_RESET,
    MARCA_REVIEW_CREATE_SUCCESS,
    MARCA_REVIEW_LIST_FAIL,
    MARCA_REVIEW_LIST_REQUEST,
    MARCA_REVIEW_LIST_SUCCESS,
    TOPMARCAS_LIST_FAIL,
    TOPMARCAS_LIST_REQUEST,
    TOPMARCAS_LIST_SUCCESS
} from '../constants/marcaConstants';

// Reducer para crear una marca
export const marcaCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case MARCA_CREATE_REQUEST:
            return { loading: true };
        case MARCA_CREATE_SUCCESS:
            return { loading: false, marcas: action.payload };
        case MARCA_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}

// Reducer para listar marcas
export const listarMarcasReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case MARCA_LIST_REQUEST:
            return { loading: true };
        case MARCA_LIST_SUCCESS:
            return {
                loading: false,
                marcas: action.payload
            };
        case MARCA_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
};

// Listar marcas para el carrusel
export const listarMarcasTopReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case TOPMARCAS_LIST_REQUEST:
            return { loading: true };
        case TOPMARCAS_LIST_SUCCESS:
            return {
                loading: false,
                marcas: action.payload
            };
        case TOPMARCAS_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
};

// Traer marca por id
export const marcaDetailsReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case MARCA_DETAILS_REQUEST:
            return { loading: true };
        case MARCA_DETAILS_SUCCESS:
            return { loading: false, marca: action.payload };
        case MARCA_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case MARCA_DETAILS_RESET:
            return { loading: true };
        default:
            return state;
    }
};

// Para crear reseñas
export const marcaReviewCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case MARCA_REVIEW_CREATE_REQUEST:
            return { loading: true };
        case MARCA_REVIEW_CREATE_SUCCESS:
            return { loading: false, success: true, review: action.payload };
        case MARCA_REVIEW_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case MARCA_REVIEW_CREATE_RESET:
            return {};
        default:
            return state;
    }
}

//Para listar reseñas
export const marcaReviewListReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case MARCA_REVIEW_LIST_REQUEST:
            return { loading: true };
        case MARCA_REVIEW_LIST_SUCCESS:
            return { loading: false, reviews: action.payload };
        case MARCA_REVIEW_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}