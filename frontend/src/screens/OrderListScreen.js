import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { deleteOrder, listarPedidos } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';
import formatoPy from '../util';

export default function OrderListScreen(props) {
    const { pageNumber = 1 } = useParams();

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, pedidos, page, pages } = orderList;

    const orderDelete = useSelector((state) => state.orderDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = orderDelete;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ORDER_DELETE_RESET });
        dispatch(listarPedidos(pageNumber));
    }, [dispatch, successDelete, pageNumber,]);
    //preguntamos si queremos borrar, e importamos el evento desde OrderActions.js
    const deleteHandler = (order) => {
        if (window.confirm('Estás seguro que deseas eliminar??')) {
            dispatch(deleteOrder(order.nro_pedido));
        }
    };
    return (
        <div className="margen contenedor">
            <div>
                <h1>Pedidos</h1>
                {loadingDelete && <LoadingBox></LoadingBox>}
                {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
                {loading ? <LoadingBox></LoadingBox> :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                        : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>CODIGO</th>
                                            <th>USUARIO</th>
                                            <th>FECHA</th>
                                            <th>TOTAL</th>
                                            <th>PAGO</th>
                                            <th>ENTREGA</th>
                                            <th>ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.map((order) => (
                                            <tr key={order.nro_pedido}>
                                                <td>{order.nro_pedido}</td>
                                                <td>{order.nombre_completo}</td>
                                                <td>{order.fecha_pedido.substring(0, 10)}</td>
                                                <td>{formatoPy(order.precio_total)}</td>
                                                <td>{order.pagado ? order.fecha_pago.substring(0, 10) : 'No'}</td>
                                                <td>
                                                    {order.entregado
                                                        ? order.fecha_entrega.substring(0, 10)
                                                        : 'No'}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="small"
                                                        onClick={() => {
                                                            props.history.push(`/order/${order.nro_pedido}`);
                                                        }}
                                                    >
                                                        Detalles
                                                </button>
                                                    <button
                                                        type="button"
                                                        className="small"
                                                        onClick={() => deleteHandler(order)}
                                                    >
                                                        Eliminar
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="row center pagination">
                                    {[...Array(pages).keys()].map((x) => (
                                        <Link
                                            className={x + 1 === page ? 'active' : ''}
                                            key={x + 1}
                                            to={`/orderlist/pageNumber/${x + 1}`}
                                        >{x + 1}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
            </div>
        </div>
    )
}
