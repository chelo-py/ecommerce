import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../../node_modules/axios/index';
import { createProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function CrearProductoScreen(props) {
    const productId = props.match.params.id;
    const [nombre, setNombre] = useState('');
    const [imagen, setImagen] = useState('');
    const [categoria, setCategoria] = useState('');
    const [subcategoria, setSubCategoria] = useState('');
    const [stock, setStock] = useState('');
    const [cod_marca, setCod_Marca] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const dispatch = useDispatch();

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const productCreate = useSelector((state) => state.productCreate);
    const { loading, error, success } = productCreate;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const listarMarcas = useSelector((state) => state.marcaListar);
    const {
        loading: loadingMarcas,
        error: errorMarcas,
        marcas
    } = listarMarcas;

    useEffect(() => {
        if (success) {
            props.history.push('/productlist')
        }
    }, [dispatch, props.history, success])

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

    const createHandler = (e) => {
        e.preventDefault();
        var codMarca = cod_marca.split(' - ');
        dispatch(createProduct(codMarca[0], nombre, imagen, categoria, subcategoria, stock, descripcion,))
    }

    return (
        <div className="margen">
            <div className="contenedor">
                <h1 className=" margen-iz-2">Crear Producto {productId}</h1>
            </div>
            {success && (
                <MessageBox variant="success">
                    Producto creado con éxito
                </MessageBox>
            )}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <form className="form" onSubmit={createHandler}>
                        <div>
                            <label>Marca</label>
                            <select
                                name="marca"
                                id="marca"
                                required
                                value={cod_marca}
                                onChange={(e) => setCod_Marca(e.target.value)}>
                                <option>
                                    Selecciona una marca
                                </option>
                                {loadingMarcas ? (
                                    <LoadingBox></LoadingBox>
                                ) : errorMarcas ? (
                                    <MessageBox variant="danger">{errorMarcas}</MessageBox>
                                ) : (
                                    <>
                                        {marcas.map((marca) => (
                                            <option key={marca.cod_marca} name={marca.cod_marca}>
                                                {marca.cod_marca} - {marca.nombre}
                                            </option>
                                        ))};
                            </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="npmbre"
                                type="text"
                                placeholder="Ingresar Nombre"
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
                            <label htmlFor="category">Categoría</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="Ingresar categoría"
                                onChange={(e) => setCategoria(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="subCategory">Sub Categoría</label>
                            <input
                                id="subCategory"
                                type="text"
                                placeholder="Ingresar sub Categoría"
                                onChange={(e) => setSubCategoria(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="countInStock">Cantidad en stock</label>
                            <input
                                id="countInStock"
                                type="text"
                                placeholder="Ingresar cantidad en stock"
                                onChange={(e) => setStock(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                rows="3"
                                type="text"
                                placeholder="Ingresar descripción"
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label></label>
                            <button className="primary" type="submit">
                                Crear Producto
                                    </button>
                        </div>
                    </form>
                </>
            )
            }
        </div >
    )
}
