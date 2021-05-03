import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { listarPrecios } from '../actions/listaPrecioActions';
// import { listarProductos } from '../actions/productActions';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [ruc, setRuc] = useState('');
    const [ci, setCi] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    //const [lista_precio, setlista_precio] = useState('');

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    const userRegister = useSelector((state) => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    // const listarPrecio = useSelector((state) => state.listaPrecios);
    // const {
    //     loading: loadingPrecio,
    //     error: errorPrecio,
    //     listaPrecio
    // } = listarPrecio;

    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Ambas contraseñas deben ser iguales');
        }
        else {
            dispatch(register(name, email, password, ruc, ci /*lista_precio*/))
        }
    };
    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect);
        }
    }, [dispatch, props.history, redirect, userInfo]);

    return (
        <div className="margen">
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Crear una cuenta</h1>
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Ingresar nombre completo"
                        required
                        onChange={(e) => setName(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Ingresar correo"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="ci">Cédula de Identidad</label>
                    <input
                        type="text"
                        id="ci"
                        placeholder="Ingresar cédula"
                        required
                        onChange={(e) => setCi(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="ruc">Ruc</label>
                    <input
                        type="text"
                        id="ruc"
                        placeholder="Ingresar Ruc"
                        onChange={(e) => setRuc(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Ingresar contraseña"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Ingresar contraseña"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">
                        Registarse
                    </button>
                </div>
                <div>
                    <label />
                    <div>
                        Ya tienes una cuenta?{' '}
                        <a href={`/signin?redirect=${redirect}`}>
                            <span className="color-azul">Inicia sesión</span>
                        </a>
                    </div>
                </div>
            </form>
        </div>
    )
}
