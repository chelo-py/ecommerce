import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { deleteProduct, listarProductos } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants';
//import formatoPy from '../util';

export default function ProductListScreen(props) {

    const { pageNumber = 1 } = useParams();

    const listadoProducto = useSelector((state) => state.listadoProducto);
    const { loading, error, productos, page, pages } = listadoProducto;

    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listarProductos(pageNumber));
        if (successDelete) {
            dispatch({ type: PRODUCT_DETAILS_RESET });
        }
    }, [
        dispatch,
        props.history,
        successDelete,
        userInfo.cod_usuario,
        pageNumber,
    ]);
    const deleteHandler = (product) => {
        if (window.confirm('Está seguro que desea eliminar el producto??')) {
            dispatch(deleteProduct(product.cod_articulo))
        }
    };

    return (
        <div className="margen contenedor">
            <div className="row">
                <h1>Productos</h1>

                <div className="row gap">
                    <a href='/crearProducto'>
                        <button type="button" className="primary" >
                            Crear Producto
                        </button>
                    </a>
                </div>
            </div>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {successDelete && (
                <MessageBox variant="success">Producto eliminado correctamente</MessageBox>
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
                                <th>CATEGORIA</th>
                                <th>SUBCATEGORIA</th>
                                <th>MARCA</th>
                                <th>ACCI0NES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.cod_articulo}>
                                    <td>{producto.cod_articulo}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{producto.subcategoria}</td>
                                    <td>{producto.marca}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="small"
                                            onClick={() => props.history.push(`/product/${producto.cod_articulo}/edit`)}
                                        > Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="small"
                                            onClick={() => deleteHandler(producto)}
                                        > Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row center pagination">
                        {[...Array(pages).keys()].map((x) => (
                            <>
                                <Link
                                    className={x + 1 === page ? 'active' : ''}
                                    key={x + 1}
                                    to={`/productlist/pageNumber/${x + 1}`}
                                >{x + 1}
                                </Link>
                            </>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}