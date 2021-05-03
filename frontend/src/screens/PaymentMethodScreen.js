import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
export default function PaymentMethodScreen(props) {

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    if (!shippingAddress.direccion) {
        props.history.push('/shipping');
    }
    const [metodoPago, setMetodoPago] = useState('PayPal');
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(metodoPago));
        props.history.push('/placeorder');
    };
    return (
        <div className="margen">
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Método de pago</h1>
                </div>
                <div>
                    <div>
                        <input
                            type="radio"
                            id="paypal"
                            value="PayPal"
                            name="metodoPago"
                            required
                            checked
                            onChange={(e) => setMetodoPago(e.target.value)}
                        ></input>
                        <label htmlFor="paypal">PayPal</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input
                            type="radio"
                            id="stripe"
                            value="Stripe"
                            name="metodoPago"
                            required
                            onChange={(e) => setMetodoPago(e.target.value)}
                        ></input>
                        <label htmlFor="stripe">Stripe</label>
                    </div>
                </div>
                <div>
                    <button className="primary" type="submit">Continuar</button>
                </div>
            </form>
        </div>
    )
}