import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps'

export default function ShippingAddressScreen(props) {
    const userSignin = useSelector((state) => state.userSignin);

    const { userInfo } = userSignin;
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const [lat, setLat] = useState(shippingAddress.lat);
    const [lng, setLng] = useState(shippingAddress.lng);
    const userAddressMap = useSelector((state) => state.userAddressMap);
    const { direccion: addressMap } = userAddressMap;


    if (!userInfo) {
        props.history.push('/signin');
    }
    const [nombreCompleto, setNombreCompleto] = useState(shippingAddress.nombreCompleto);
    const [direccion, setDireccion] = useState(shippingAddress.direccion);
    const [ciudad, setCiudad] = useState(shippingAddress.ciudad);
    const [barrio, setBarrio] = useState(shippingAddress.barrio);
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;
        if (addressMap) {
            setLat(addressMap.lat);
            setLng(addressMap.lng);
        }
        let moveOn = true;
        if (!newLat || !newLng) {
            moveOn = window.confirm(
                'No has colocado tu ubicación en el mapa. Continuar?'
            );
        }
        if (moveOn) {
            dispatch(
                saveShippingAddress({
                    nombreCompleto,
                    direccion,
                    ciudad,
                    barrio,
                    lat: newLat,
                    lng: newLng,
                })
            );
            props.history.push('/payment');
        }
    };
    const chooseOnMap = () => {
        dispatch(
            saveShippingAddress({
                nombreCompleto,
                direccion,
                ciudad,
                barrio,
                lat,
                lng,
            })
        );
        props.history.push('/map');
    }
    return (
        <div className="margen">
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Dirección de envío.</h1>
                </div>
                <div>
                    <label htmlFor="fullName">Nombre Completo</label>
                    <input type="text"
                        id="fullName"
                        placeholder="Ingresar nombre completo"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="address">Dirección</label>
                    <input type="text"
                        id="address"
                        placeholder="Ingresar dirección"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="postalCode">Barrio</label>
                    <input type="text"
                        id="postalcode"
                        placeholder="Ingresar barrio"
                        value={barrio}
                        onChange={(e) => setBarrio(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="city">Ciudad</label>
                    <input type="text"
                        id="city"
                        placeholder="Ingresar ciudad"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="chooseOnMap">Ubicación</label>
                    <button type="button" onClick={chooseOnMap}>
                        Elegir en el mapa
                    </button>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
}
