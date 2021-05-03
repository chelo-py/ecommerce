import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { USER_UPDATE_RESET } from '../constants/userConstants';

export default function UserEditScreen(props) {
    const userId = props.match.params.id;
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successupdate,
    } = userUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if (successupdate) {
            dispatch({ type: USER_UPDATE_RESET });
            props.history.push('/userlist');
        }
        if (!user) {
            dispatch(detailsUser(userId));
        } else {
            setNombre(user.nombre);
            setEmail(user.email);
            setIsAdmin(user.is_admin);
        }
    }, [
        dispatch, user, userId, successupdate, props.history
    ]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ cod_usuario: userId, nombre, email, isAdmin }));
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Editar Usuario {nombre}</h1>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                    {errorUpdate && (
                        <MessageBox variant="danger">{errorUpdate}</MessageBox>
                    )}
                    {successupdate && (
                        <MessageBox variant="success">Usuario actualizado correctamente</MessageBox>
                    )}
                </div>
                {loading ? <LoadingBox /> :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                        :
                        <>
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
                                <label htmlFor="email">Correo</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Ingresar correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></input>
                            </div>
                            <div className="admin-checkbox">
                                <div>
                                    <label htmlFor="isAdmin">Es Admin</label>
                                    <input
                                        id="isAdmin"
                                        type="checkbox"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="primary">
                                    Actualizar
                                </button>
                            </div>
                        </>
                }
            </form>
        </div>
    )
}
