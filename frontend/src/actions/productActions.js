import Axios from 'axios';
import {
  LISTAR_PRODUCTOS_MARCA_2_FAIL,
  LISTAR_PRODUCTOS_MARCA_2_REQUEST,
  LISTAR_PRODUCTOS_MARCA_2_SUCCESS,
  LISTAR_PRODUCTOS_MARCA_FAIL,
  LISTAR_PRODUCTOS_MARCA_REQUEST,
  LISTAR_PRODUCTOS_MARCA_SUCCESS,
  LISTAR_PRODUCTO_FAIL,
  LISTAR_PRODUCTO_REQUEST,
  LISTAR_PRODUCTO_SUCCESS,
  LISTAR_UN_PRODUCTO_FAIL,
  LISTAR_UN_PRODUCTO_REQUEST,
  LISTAR_UN_PRODUCTO_SUCCESS,
  PRODUCTO_REVIEW_LIST_FAIL,
  PRODUCTO_REVIEW_LIST_REQUEST,
  PRODUCTO_REVIEW_LIST_SUCCESS,
  PRODUCT_CATEGORY_LIST_FAIL,
  PRODUCT_CATEGORY_LIST_REQUEST,
  PRODUCT_CATEGORY_LIST_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
} from '../constants/productConstants';


export const listarUnProducto = ({
  categoria = '',
}) => async (dispatch) => {
  dispatch({
    type: LISTAR_UN_PRODUCTO_REQUEST,
  });
  try {
    const { data } = await Axios.get(
      `/api/productos/listar?categoria=${categoria}`
    );
    dispatch({ type: LISTAR_UN_PRODUCTO_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LISTAR_UN_PRODUCTO_FAIL, payload: error.message });
  }
};

// Listar productos
export const productoList = () => async (dispatch) => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/productos`);
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message })
  }
}

// Listar productos con paginación
export const listarProductos = (pageNumber = '') => async (dispatch, getState) => {
  dispatch({ type: LISTAR_PRODUCTO_REQUEST });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.get(`/api/productos/listar-productos?pageNumber=${pageNumber}`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
    dispatch({ type: LISTAR_PRODUCTO_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LISTAR_PRODUCTO_FAIL, payload: error.message });
  }
};

// Listar productos por marcas
export const listarProductosMarcas = ({ marca = '', pageNumber = '' }) => async (dispatch) => {
  dispatch({ type: LISTAR_PRODUCTOS_MARCA_REQUEST });
  try {
    const { data } = await Axios.get(`/api/productos/listar?marca=${marca}&pageNumber=${pageNumber}`);
    dispatch({ type: LISTAR_PRODUCTOS_MARCA_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: LISTAR_PRODUCTOS_MARCA_FAIL, payload: error.message })
  }
};

// Listar productos por marcas 2
export const listarProductosMarcas2 = ({ articulo = '' }) => async (dispatch) => {
  dispatch({ type: LISTAR_PRODUCTOS_MARCA_2_REQUEST });
  try {
    const { data } = await Axios.get(`/api/productos/listar2?articulo=${articulo}`);
    dispatch({ type: LISTAR_PRODUCTOS_MARCA_2_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: LISTAR_PRODUCTOS_MARCA_2_FAIL, payload: error.message })
  }
};

// Traer producto por id
export const detailsProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/productos/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Crear producto
export const createProduct = (cod_marca, nombre, imagen, categoria, subcategoria, stock, descripcion) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      '/api/productos/crearproducto',
      { cod_marca, nombre, imagen, categoria, subcategoria, stock, descripcion },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
  }
};

// Actualizar producto
export const updateProduct = (producto) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: producto });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/productos/${producto.cod_articulo}`, producto, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};

//Función para eliminar un producto 
export const deleteProduct = (productId) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
  const { userSignin: { userInfo } } = getState();
  try {
    const { data } = await Axios.delete(`/api/productos/${productId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: message })
  }
};

// Crear reseña 
export const createReview = (productId, review) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = await Axios.post(
      `/api/productos/${productId}/reviews`,
      review,
      { headers: { Authorization: `Bearer ${userInfo.token}` }, }
    );
    dispatch({
      type: PRODUCT_REVIEW_CREATE_SUCCESS,
      payload: data.review,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_REVIEW_CREATE_FAIL, payload: message });
  }
};

//Acción para listar productos 
export const listProducts = ({
  marca = '',
  pageNumber = '',
  name = '',
  categoria = '',
  order = '',
  min = 0,
  max = 0,
  rating = 0,
}) => async (dispatch) => {
  dispatch({
    type: PRODUCT_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(
      `/api/productos/buscador?marca=${marca}&pageNumber=${pageNumber}&name=${name}&categoria=${categoria}&min=${min}&max=${max}&rating=${rating}&order=${order}`
    );
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

//Listar productos por categorías
export const listProductCategories = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_CATEGORY_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(`/api/productos/categorias`);
    dispatch({ type: PRODUCT_CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_CATEGORY_LIST_FAIL, payload: error.message });
  }
};

//Listar reseñas
export const listarReviews = ({ articulo = '' }) => async (dispatch) => {
  dispatch({ type: PRODUCTO_REVIEW_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/productos/${articulo}/reviews`);
    dispatch({ type: PRODUCTO_REVIEW_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCTO_REVIEW_LIST_FAIL, payload: error.message })
  }
}