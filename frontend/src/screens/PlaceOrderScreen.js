import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import formatoPy from '../util';

export default function PlaceOrderScreen(props) {
    const cart = useSelector((state) => state.cart);
    if (!cart.paymentMethod) {
        props.history.push('/payment')
    }
    const orderCreate = useSelector((state) => state.orderCreate);
    const { loading, success, error, order } = orderCreate;

    const toPrice = (num) => Number(num.toFixed(2)); //5.123 => "5.12" => 5.12
    cart.precioProductos = toPrice(
        cart.cartItems.reduce((a, c) => a + c.cantidad * c.precio, 0)
    );
    cart.precioEnvio = cart.precioProductos > 100 ? toPrice(0) : toPrice(10);
    cart.iva = toPrice(0.15 * cart.precioProductos);
    cart.precioTotal = cart.precioProductos + cart.precioEnvio + cart.iva;
    const dispatch = useDispatch();

    const placeOrderHandler = () => {
        dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
    };
    useEffect(() => {
        if (success) {
            props.history.push(`/order/${order.nro_pedido}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, order, props.history, success]);

    return (
        <div className="margen">
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <div className="row top contenedor">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card2 card-body">
                                <h2>Envío</h2>
                                <p>
                                    <strong>Nombre:</strong> {cart.shippingAddress.nombreCompleto} <br />
                                    <strong>Dirección:</strong> {cart.shippingAddress.direccion}
                                    <strong className="margen-iz-2">barrio:</strong> {cart.shippingAddress.barrio}
                                    <strong className="margen-iz-2">ciudad:</strong> {cart.shippingAddress.ciudad}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card2 card-body">
                                <h2>Pago</h2>
                                <p>
                                    <strong>Método:</strong> {cart.paymentMethod}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card2 card-body">
                                <h2>Lista de artículos</h2>
                                <ul>
                                    {cart.cartItems.map((item) => (
                                        <li key={item.producto}>
                                            <div className="row">
                                                <div>
                                                    <img
                                                        src={item.imagen}
                                                        alt={item.nombre}
                                                        className="small"
                                                    ></img>
                                                </div>
                                                <div className="min-30">
                                                    <Link to={`/product/${item.producto}`}
                                                    >{item.nombre}</Link>
                                                </div>
                                                <div>
                                                    {item.cantidad} x Gs. {formatoPy(item.precio)} = Gs. {formatoPy(item.cantidad * item.precio)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <h2>Resumen de pedido</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Artículos</div>
                                    <div>Gs. {formatoPy(cart.precioProductos)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Envío</div>
                                    <div>Gs. {cart.precioEnvio}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Iva</div>
                                    <div>Gs. {formatoPy(cart.iva)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>
                                        <strong>Total de pedido </strong> </div>
                                    <div>
                                        <strong>Gs. {formatoPy(cart.precioTotal)} </strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={placeOrderHandler}
                                    className="primary block"
                                    disabled={cart.cartItems.length === 0}
                                >
                                    Realizar Pedido
                                </button>
                            </li>
                            {loading && <LoadingBox></LoadingBox>}
                            {error && <MessageBox variant="danger">{error}</MessageBox>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
