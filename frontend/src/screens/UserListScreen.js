import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { USER_DETAILS_RESET } from '../constants/userConstants';

export default function UserListScreen(props) {

    const { pageNumber = 1 } = useParams();

    const userList = useSelector((state) => state.userList);
    const { loading, error, users, page, pages } = userList;

    const userDelete = useSelector((state) => state.userDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = userDelete;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listUsers({ pageNumber }));
        dispatch({ type: USER_DETAILS_RESET, });
    }, [dispatch, successDelete, pageNumber]);

    const deleteHandler = (user) => {
        if (window.confirm('Estás seguro?')) {
            dispatch(deleteUser(user.cod_usuario));
        }
    }
    return (
        <div className="margen contenedor">
            <h1>Usuarios</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {successDelete && (
                <MessageBox variant="success">Usuario eliminado correctamente</MessageBox>
            )}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>CORREO</th>
                                <th>ES ADMIN</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.cod_usuario}>
                                    <td>{user.cod_usuario}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.email}</td>
                                    <td>{user.is_admin ? 'SI' : 'NO'}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="small"
                                            onClick={() => props.history.push(`/user/${user.cod_usuario}/edit`)}
                                        >Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="small"
                                            onClick={() => deleteHandler(user)}
                                        >Eliminar
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
                                to={`/userlist/pageNumber/${x + 1}`}>
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )
            }
        </div>
    );
}
