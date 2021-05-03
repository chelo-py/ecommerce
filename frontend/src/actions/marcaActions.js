import Axios from 'axios';
import {
    MARCA_CREATE_REQUEST,
    MARCA_CREATE_SUCCESS,
    MARCA_CREATE_FAIL,
    MARCA_LIST_REQUEST,
    MARCA_LIST_SUCCESS,
    MARCA_LIST_FAIL,
    TOPMARCAS_LIST_REQUEST,
    TOPMARCAS_LIST_SUCCESS,
    TOPMARCAS_LIST_FAIL,
    MARCA_DETAILS_REQUEST,
    MARCA_DETAILS_SUCCESS,
    MARCA_DETAILS_FAIL,
    MARCA_REVIEW_CREATE_REQUEST,
    MARCA_REVIEW_CREATE_SUCCESS,
    MARCA_REVIEW_CREATE_FAIL,
    MARCA_REVIEW_LIST_REQUEST,
    MARCA_REVIEW_LIST_SUCCESS,
    MARCA_REVIEW_LIST_FAIL
} from '../constants/marcaConstants';

// Acción para crear Marcas
const crearMarca = (nombre, descripcion, logo) => async (dispatch, getState) => {
    dispatch({ type: MARCA_CREATE_REQUEST, payload: { nombre, descripcion, logo } });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await Axios.post('/api/marca/crearmarca',
            {
                nombre,
                descripcion,
                logo,
            },
            {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            }
        );
        dispatch({
            type: MARCA_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: MARCA_CREATE_FAIL, payload: message });
    }
};

// Acción para listar Marcas
export const listarMarcas = () => async (dispatch) => {
    dispatch({ type: MARCA_LIST_REQUEST });
    try {
        const { data } = await Axios.get(
            '/api/marca',
        );
        dispatch({ type: MARCA_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: MARCA_LIST_FAIL, payload: message })
    }
};

// Acción para listar el top de marcas
export const listTopMarcas = () => async (dispatch) => {
    dispatch({ type: TOPMARCAS_LIST_REQUEST });
    try {
        const { data } = await Axios.get('/api/marca/top-marcas');
        dispatch({ type: TOPMARCAS_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: TOPMARCAS_LIST_FAIL, payload: message })
    }
}

// Traer marca por id
export const detailsMarca = (marcaId) => async (dispatch,) => {
    dispatch({ type: MARCA_DETAILS_REQUEST, payload: marcaId });
    try {
        const { data } = await Axios.get(`/api/marca/${marcaId}`, {
        });
        dispatch({ type: MARCA_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: MARCA_DETAILS_FAIL, payload: message })
    }
};

// Crear review
export const createReview = (marcaId, review) => async (dispatch, getState) => {
    dispatch({ type: MARCA_REVIEW_CREATE_REQUEST });
    const { userSignin: { userInfo }, } = getState();
    try {
        const { data } = await Axios.post(
            `/api/marca/${marcaId}/reviews`,
            review,
            { headers: { Authorization: `Bearer ${userInfo.token}` }, }
        );
        dispatch({
            type: MARCA_REVIEW_CREATE_SUCCESS,
            payload: data.review,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: MARCA_REVIEW_CREATE_FAIL, payload: message });
    }
};

//Listar reseñas
export const listarReviewsMarca = ({ marca = '' }) => async (dispatch) => {
    dispatch({ type: MARCA_REVIEW_LIST_REQUEST })
    try {
        const { data } = await Axios.get(`/api/marca/${marca}/reviews`);
        dispatch({ type: MARCA_REVIEW_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: MARCA_REVIEW_LIST_FAIL, payload: error.message })
    }
}

export default crearMarca;