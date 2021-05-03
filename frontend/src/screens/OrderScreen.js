import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder, listarDetalles } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';
import formatoPy from '../util';

export default function OrderScreen(props) {
    // const [nombreCompleto, setnombreCompleto] = useState('')
    // const [direccion, setDireccion] = useState('')
    // const [ciudad, setCiudad] = useState('')
    // const [barrio, setBarrio] = useState('')
    // const [entregado, setEntregado] = useState('')

    const orderId = props.match.params.id;
    const [sdkReady, setSdkReady] = useState(false);

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const orderPay = useSelector((state) => state.orderPay);
    const {
        loading: loadingPay,
        error: errorPay,
        success: successPay,
    } = orderPay;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const {
        loading: loadingDeliver,
        error: errorDeliver,
        success: successDeliver,
    } = orderDeliver;

    const detalleOrden = useSelector((state) => state.listarOrdenDetalle);
    const {
        loading: loadingDetalle,
        error: errorDetalle,
        detalles
    } = detalleOrden;

    const dispatch = useDispatch();

    useEffect(() => {
        const addPayPalScript = async () => {
            const { data } = await Axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };
        if (
            !order ||
            successPay ||
            successDeliver ||
            (order && order.nro_pedido !== parseInt(orderId))) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(detailsOrder(orderId));
            dispatch(listarDetalles({ order: orderId }))
        } else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
    }, [dispatch, order, orderId, sdkReady, successPay, successDeliver]);

    //Función del botón pagar
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult));
    }

    //Función para el botón entregar
    const deliverHandler = () => {
        dispatch(deliverOrder(order.nro_pedido));
    };

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div className="margen contenedor">
            <h1 className="margen-iz-2">Pedido Nro. {orderId}</h1>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card2 card-body">
                                <h2>Envío</h2>
                                <p>
                                    <strong>Nombre:</strong> {order.nombre_Completo} <br />
                                    <strong>Dirección:</strong> {order.direccion}
                                    <strong className="margen-iz-2">barrio:</strong> {order.barrio}
                                    <strong className="margen-iz-2">ciudad:</strong> {order.ciudad}
                                </p>
                                {order.entregado ? (
                                    <MessageBox variant="success">
                                        Entregado a las {order.fecha_entrega}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant="danger">No Entregado</MessageBox>
                                )}
                            </div>
                        </li>
                        <li>
                            <div className="card2 card-body">
                                <h2>Pago</h2>
                                <p>
                                    <strong>Método:</strong> {order.metodo_pago}
                                </p>
                                {order.pagado ? (
                                    <MessageBox variant="success">
                                        Pagado a las {order.fecha_pago}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant="danger">No Pagado</MessageBox>
                                )}
                            </div>
                        </li>
                        <li>
                            <div className="card2 card-body">
                                <h2>Lista de artículos</h2>
                                {loadingDetalle ? (
                                    <LoadingBox></LoadingBox>
                                ) : errorDetalle ? (
                                    <MessageBox variant="danger">{errorDetalle}</MessageBox>
                                ) : (
                                    <ul>
                                        {detalles.map((item) => (
                                            <li key={item.nombre}>
                                                <div className="row">
                                                    <div>
                                                        <img
                                                            src={item.imagen}
                                                            alt={item.nombre}
                                                            className="small"
                                                        ></img>
                                                    </div>
                                                    <div className="min-30">
                                                        <Link to={`/product/${item.codarticulo}`}
                                                        >{item.nombre}</Link>
                                                    </div>
                                                    <div>
                                                        {item.cantidad} x Gs. {formatoPy(item.precio)} = Gs. {formatoPy(item.cantidad * item.precio)}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                    <div className="card2 card-body">
                        <ul>
                            <li>
                                <h2>Resumen de pedido</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Artículos</div>
                                    <div>Gs. {formatoPy(order.precio_productos)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Envío</div>
                                    <div>Gs. {order.precio_envio}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Iva</div>
                                    <div>Gs. {formatoPy(order.precio_iva)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>
                                        <strong>Total de pedido </strong> </div>
                                    <div>
                                        <strong>Gs. {formatoPy(order.precio_total)} </strong>
                                    </div>
                                </div>
                            </li>
                            {!order.pagado && (
                                <li>
                                    {!sdkReady ? (
                                        <LoadingBox></LoadingBox>
                                    ) : (
                                        <>
                                            {errorPay && (
                                                <MessageBox variant="danger">{errorPay}</MessageBox>
                                            )}
                                            {loadingPay && <LoadingBox></LoadingBox>}
                                            <PayPalButton
                                                amount={order.precio_total}
                                                onSuccess={successPaymentHandler}
                                            ></PayPalButton>
                                        </>
                                    )}
                                </li>
                            )}
                            {userInfo.is_admin && order.pagado && !order.entregado && (
                                <li>
                                    {loadingDeliver && <LoadingBox></LoadingBox>}
                                    {errorDeliver && (
                                        <MessageBox variant="danger">{errorDeliver}</MessageBox>
                                    )}
                                    <button type="button" className="primary block" onClick={deliverHandler}>
                                        Entregar Pedido
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
