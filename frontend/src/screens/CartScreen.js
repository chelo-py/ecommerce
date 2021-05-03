import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';
import formatoPy from '../util';

export default function CartScreen(props) {
    const productId = props.match.params.id;

    const cantidad = props.location.search
        ? Number(props.location.search.split('=')[1])
        : 1;

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const dispatch = useDispatch();
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, cantidad));
        }
    }, [dispatch, productId, cantidad]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        props.history.push('/signin?redirect=shipping');
    };

    return (
        <div className="row top margen contenedor ">
            <div className="col-2 margen-iz-2">
                <h1>Carrito de Compras</h1>

                {cartItems.length === 0 ? <MessageBox>
                    Tu carrito está vacío. <Link to="/">Ve de Compras!</Link>
                </MessageBox>
                    :
                    (
                        <ul>
                            {cartItems.map((item) => (
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
                                            <select value={item.cantidad}
                                                onChange={e =>
                                                    dispatch(
                                                        addToCart(item.producto, Number(e.target.value))
                                                    )}
                                            >
                                                {
                                                    [...Array(item.stock).keys()].map(
                                                        (x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div>Gs.{formatoPy(item.precio)}</div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => removeFromCartHandler(item.product)}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                }
            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Subtotal ({cartItems.reduce((a, c) => a + c.cantidad, 0)} artículo) : Gs.
                                {formatoPy(cartItems.reduce((a, c) => a + c.precio * c.cantidad, 0))}
                            </h2>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={checkoutHandler}
                                className="primary block"
                                disabled={cartItems.length === 0}
                            >
                                Proceder al pago
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
