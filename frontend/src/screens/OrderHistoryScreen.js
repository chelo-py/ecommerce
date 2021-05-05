import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import formatoPy from '../util';

export default function OrderHistoryScreen(props) {
    const { pageNumber = 1 } = useParams();
    
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const userId = userInfo.cod_usuario;

    const orderMineList = useSelector(state => state.orderMineList);
    const { loading, error, pedidos, page, pages } = orderMineList;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listOrderMine({ usuario: userId, pageNumber }));
    }, [dispatch, pageNumber, userId]);
    return (
        <div className="margen contenedor">
            <h1>Historial de Pedidos</h1>
            {loading ? <LoadingBox></LoadingBox> :
                error ? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
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
                                        to={`/orderhistory/pageNumber/${x + 1}`}>
                                        {x + 1}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
        </div>
    );
}
