const {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_RESET,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_RESET,
  PRODUCT_CATEGORY_LIST_REQUEST,
  PRODUCT_CATEGORY_LIST_SUCCESS,
  PRODUCT_CATEGORY_LIST_FAIL,
  PRODUCT_REVIEW_CREATE_RESET,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_SUB_CATEGORY_LIST_SUCCESS,
  PRODUCT_SUB_CATEGORY_LIST_REQUEST,
  PRODUCT_SUB_CATEGORY_LIST_FAIL,
  LISTAR_PRODUCTO_REQUEST,
  LISTAR_PRODUCTO_SUCCESS,
  LISTAR_PRODUCTO_FAIL,
  LISTAR_UN_PRODUCTO_REQUEST,
  LISTAR_UN_PRODUCTO_SUCCESS,
  LISTAR_UN_PRODUCTO_FAIL,
  LISTAR_PRODUCTOS_MARCA_SUCCESS,
  LISTAR_PRODUCTOS_MARCA_REQUEST,
  LISTAR_PRODUCTOS_MARCA_FAIL,
  PRODUCTO_REVIEW_LIST_REQUEST,
  PRODUCTO_REVIEW_LIST_SUCCESS,
  PRODUCTO_REVIEW_LIST_FAIL,
  LISTAR_PRODUCTOS_MARCA_2_REQUEST,
  LISTAR_PRODUCTOS_MARCA_2_SUCCESS,
  LISTAR_PRODUCTOS_MARCA_2_FAIL,
} = require('../constants/productConstants');

export const listarUnProductoReducer = (
  state = { loading: true, products: [] }, action
) => {
  switch (action.type) {
    case LISTAR_UN_PRODUCTO_REQUEST:
      return { loading: true };
    case LISTAR_UN_PRODUCTO_SUCCESS:
      return { loading: false, products: action.payload.products }
    case LISTAR_UN_PRODUCTO_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state;
  }
}

// Listar productos con paginación 
export const listarProductoReducer = (
  state = { loading: true }, action
) => {
  switch (action.type) {
    case LISTAR_PRODUCTO_REQUEST:
      return { loading: true };
    case LISTAR_PRODUCTO_SUCCESS:
      return {
        loading: false,
        productos: action.payload.productos,
        page: action.payload.page,
        pages: action.payload.pages
      };
    case LISTAR_PRODUCTO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Listar productos
export const productListReducer = (
  state = { loading: true },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        productos: action.payload
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Listar productos por marca
export const listarProductosMarcaReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case LISTAR_PRODUCTOS_MARCA_REQUEST:
      return { loading: true };
    case LISTAR_PRODUCTOS_MARCA_SUCCESS:
      return {
        loading: false,
        productos: action.payload.productos,
        page: action.payload.page,
        pages: action.payload.pages
      };
    case LISTAR_PRODUCTOS_MARCA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

// Listar productos por marca 2
export const listarProductosMarcaReducer2 = (state = { loading: true }, action) => {
  switch (action.type) {
    case LISTAR_PRODUCTOS_MARCA_2_REQUEST:
      return { loading: true };
    case LISTAR_PRODUCTOS_MARCA_2_SUCCESS:
      return { loading: false, productos: action.payload };
    case LISTAR_PRODUCTOS_MARCA_2_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

//Listar categoría de productos
export const productCategoryListReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_CATEGORY_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_CATEGORY_LIST_SUCCESS:
      return { loading: false, categorias: action.payload };
    case PRODUCT_CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//Listar SubCategoría de productos
export const productSubCategoryListReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_SUB_CATEGORY_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_SUB_CATEGORY_LIST_SUCCESS:
      return { loading: false, subCategories: action.payload };
    case PRODUCT_SUB_CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

// Traer producto por id
export const productDetailsReducer = (
  state = { producto: {}, loading: true },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, producto: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_DELETE_RESET:
      return {};
    default:
      return state;
  }
}

//Reducer para crear una reseña
export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_REVIEW_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, review: action.payload };
    case PRODUCT_REVIEW_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_REVIEW_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

//Listar reseñas 
export const productoReviewListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PRODUCTO_REVIEW_LIST_REQUEST:
      return { loading: true };
    case PRODUCTO_REVIEW_LIST_SUCCESS:
      return { loading: false, reviews: action.payload };
    case PRODUCTO_REVIEW_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
