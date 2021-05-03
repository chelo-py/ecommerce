import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../../node_modules/axios/index';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
    const productId = props.match.params.id;

    const [nombre, setNombre] = useState('');
    const [imagen, setImagen] = useState('');
    const [categoria, setCategoria] = useState('');
    const [subCategoria, setSubCategoria] = useState('');
    const [stock, setStock] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, producto } = productDetails;
    const productUpdate = useSelector((state) => state.productUpdate);

    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    const dispatch = useDispatch();

    useEffect(() => {
        if (successUpdate) {
            props.history.push('/productlist');
        }
        if (!producto || producto.cod_articulo !== parseInt(productId) || successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch(detailsProduct(productId));
        } else {
            setNombre(producto.nombre);
            setImagen(producto.imagen);
            setCategoria(producto.categoria);
            setSubCategoria(producto.subcategoria)
            setStock(producto.stock);
            setDescripcion(producto.descripcion);
        }

    }, [producto, dispatch, productId, successUpdate, props.history]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            updateProduct({
                cod_articulo: productId,
                nombre,
                imagen,
                categoria,
                subCategoria,
                stock,
                descripcion,
            })
        );
    };

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await Axios.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            setImagen(data);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };

    return (
        <div className="margen">
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Editar Producto {productId}</h1>
                </div>
                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <div>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Ingresar Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="imagen">Imagen</label>
                            <input
                                id="imagen"
                                type="text"
                                placeholder="Insertar imagen"
                                value={imagen}
                                onChange={(e) => setImagen(e.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="imageFile">Image File</label>
                            <input
                                type="file"
                                id="imageFile"
                                label="Seleccionar Imagen"
                                onChange={uploadFileHandler}
                            ></input>
                            {loadingUpload && <LoadingBox></LoadingBox>}
                            {errorUpload && (
                                <MessageBox variant="danger">{errorUpload}</MessageBox>
                            )}
                        </div>

                        <div>
                            <label htmlFor="categoria">Categoría</label>
                            <input
                                id="categoria"
                                type="text"
                                placeholder="Ingresar categoría"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="subCategoria">Sub Categoría</label>
                            <input
                                id="subCategoria"
                                type="text"
                                placeholder="Ingresar sub Categoría"
                                value={subCategoria}
                                onChange={(e) => setSubCategoria(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="stock">Cantidad en stock</label>
                            <input
                                id="stock"
                                type="text"
                                placeholder="Ingresar cantidad en stock"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                rows="3"
                                type="text"
                                placeholder="Ingresar descripción"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label></label>
                            <button className="primary" type="submit">
                                Actualizar
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}
