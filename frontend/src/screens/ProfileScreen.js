import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const {
        success: successUpdate,
        error: errorUpdate,
        loading: loadingUpdate,
    } = userUpdateProfile;

    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(detailsUser(userInfo.cod_usuario));
        } else {
            setNombre(user.nombre);
            setEmail(user.email);
        }
    }, [dispatch, userInfo.cod_usuario, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch update profile
        if (password !== confirmPassword) {
            alert('Las contraseñas no son iguales');
        } else {
            dispatch(
                updateUserProfile({
                    userId: user.cod_usuario,
                    nombre,
                    email,
                    password,
                })
            );
        }
    };

    return (
        <div className="margen">
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Perfil de usuario</h1>
                </div>
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                        {errorUpdate && (
                            <MessageBox variant="danger">{errorUpdate}</MessageBox>
                        )}
                        {successUpdate && (
                            <MessageBox variant="success">
                                Perfil actualizado exitosamente
                            </MessageBox>
                        )}
                        <div>
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ingresar nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Ingresar correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Ingresar contraseña"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Ingrese de nuevo su contraseña"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        <label />
                        <div>
                            <button className="primary" type="submit">
                                Actualizar
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}