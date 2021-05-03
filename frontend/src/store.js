import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore
} from 'redux';
import thunk from 'redux-thunk';
import {
    orderDeleteReducer,
    orderListReducer,
    orderMineListReducer,
    orderCreateReducer,
    orderDetailsReducer,
    orderPayReducer,
    orderDeliverReducer,
    orderDetallesListarReducer,
} from './reducers/orderReducers';
import { cartReducer } from './reducers/cartReducers';
import {
    listarProductoReducer,
    listarProductosMarcaReducer,
    listarProductosMarcaReducer2,
    listarUnProductoReducer,
    productCategoryListReducer,
    productCreateReducer,
    productDeleteReducer,
    productDetailsReducer,
    productListReducer,
    productoReviewListReducer,
    productReviewCreateReducer,
    productSubCategoryListReducer,
    productUpdateReducer
}
    from './reducers/productReducers';
import {
    userAddressMapReducer,
    userDeleteReducer,
    userDetailsReducer,
    userListReducer,
    userRegisterReducer,
    userSigninReducer,
    userUpdateProfileReducer,
    userUpdateReducer
}
    from './reducers/userReducers';
import { listaPrecioCreateReducer, listaPrecioListReducer } from './reducers/listaPreciosReducers';
import {
    marcaCreateReducer,
    listarMarcasReducer,
    listarMarcasTopReducer,
    marcaDetailsReducer,
    marcaReviewCreateReducer,
    marcaReviewListReducer
}
    from './reducers/marcaReducer';

const initialState = {
    userSignin: {
        userInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null,
    },
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        metodoPago: 'PayPal',
    },
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    productCategoryList: productCategoryListReducer,
    productSubCategoryList: productSubCategoryListReducer,
    productReviewCreate: productReviewCreateReducer,
    userAddressMap: userAddressMapReducer,
    listaPrecios: listaPrecioListReducer,
    marcaCreate: marcaCreateReducer,
    marcaListar: listarMarcasReducer,
    marcaTopList: listarMarcasTopReducer,
    listadoProducto: listarProductoReducer,
    marcaDetails: marcaDetailsReducer,
    marcaReviewCreate: marcaReviewCreateReducer,
    listaPrecioCreate: listaPrecioCreateReducer,
    listarUnProducto: listarUnProductoReducer,
    listarProductosMarca: listarProductosMarcaReducer,
    listarReviews: productoReviewListReducer,
    listarReviewsMarca: marcaReviewListReducer,
    listarProductosPorMarca: listarProductosMarcaReducer2,
    listarOrdenDetalle: orderDetallesListarReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk))
);

export default store