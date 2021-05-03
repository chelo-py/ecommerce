import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import crearListaPrecio from '../actions/listaPrecioActions';
import { listarProductos } from '../actions/productActions';

export default function CrearListaPrecioScreen() {

    const [producto, setProducto] = useState('');
    const [referencia, setReferencia] = useState('');
    const [descuento, setDescuento] = useState('');
    const [precio, setPrecio] = useState('');

    const listarProducto = useSelector((state) => state.listadoProducto);
    const {
        loading: loadingProduct,
        error: errorProduct,
        products
    } = listarProducto;

    const listaPrecioCreate = useSelector((state) => state.listaPrecioCreate);
    const { loading, success, error } = listaPrecioCreate;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listarProductos())
    }, [dispatch])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(crearListaPrecio(producto, referencia, descuento, precio))
    }

    return (
        <div className="margen contenedor">
            <h1 className="margen-iz-2">Crear Lista precio</h1>
            {success && (
                <MessageBox
                    variant="success">Marca creada con éxito
                </MessageBox>
            )}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <form className="form" onSubmit={submitHandler}>
                        <div>
                            <select
                                name="producto"
                                id="producto"
                                required
                                value={producto}
                                onChange={(e) => setProducto(e.target.value)}>
                                <option>
                                    Selecciona un producto
                        </option>
                                {loadingProduct ? (
                                    <LoadingBox></LoadingBox>
                                ) : errorProduct ? (
                                    <MessageBox variant="danger">{errorProduct}</MessageBox>
                                ) : (
                                    <>
                                        {products.map((product) => (
                                            <option key={product._id}>
                                                {product._id}
                                            </option>
                                        ))};
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="referencia">Referencia</label>
                            <input
                                type="text"
                                placeholder="Ingrese una referencia"
                                id="referencia"
                                required
                                onChange={(e) => setReferencia(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="descuento">Porcentaje descuento</label>
                            <input
                                type="number"
                                placeholder="Ingrese el porcentaje de descuento"
                                id="descuento"
                                required
                                onChange={(e) => setDescuento(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="precio">Precio unitario</label>
                            <input
                                type="number"
                                id="descuento"
                                placeholder="Ingrese el precio"
                                onChange={(e) => setPrecio(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label />
                            <button type="submit" className="primary">
                                Crear
                                </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}
