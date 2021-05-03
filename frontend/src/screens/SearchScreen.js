import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Products';
import Rating from '../components/Rating';
import { prices, ratings } from '../util';

export default function SearchScreen(props) {
    const {
        name = 'all',
        categoria = 'all',
        //subCategory = "all",
        min = 0,
        max = 0,
        rating = 0,
        order = 'newest',
        pageNumber = 1,
    } = useParams();
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, productos, page, pages } = productList;

    const productoLista = useSelector((state) => state.listarUnProducto)
    const {
        loading: loadingCategoria,
        error: errorCategoria,
        products
    } = productoLista;

    const productCategoryList = useSelector((state) => state.productCategoryList);
    const {
        loading: loadingCategories,
        error: errorCategories,
        categories,
    } = productCategoryList;

    useEffect(() => {

        console.log('entro aqui');

        dispatch(
            listProducts({
                pageNumber,
                name: name !== 'all' ? name : '',
                categoria: categoria !== 'all' ? categoria : '',
                ///subCategory: subCategory !== 'all' ? subCategory : '',
                min,
                max,
                rating,
                order,
            })
        );

        // dispatch(listarUnProducto({
        //     categoria: categoria !== 'all' ? categoria : '',
        // }));
    }, [categoria, dispatch, max, min, name, rating, order, pageNumber]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || pageNumber;
        const filterCategoria = filter.categoria || categoria;
        const filterNombre = filter.name || name;
        const filterRating = filter.rating || rating;
        const sortOrder = filter.order || order;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
        return `/search/categoria/${filterCategoria}/name/${filterNombre}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
    };

    return (
        <div className="margen contenedor">
            <div className="row">
                {loadingCategoria ? (
                    <LoadingBox></LoadingBox>
                ) : errorCategoria ? (
                    <MessageBox variant="danger">{errorCategoria}</MessageBox>
                ) : (
                    <>
                        {products.map((producto) => (
                            <p className="mayusculas fuente-roboto margen-iz-1"> home / {producto.categoria}</p>
                        ))}
                    </>
                )}
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <div > <span className="negrita">{products.length}</span> Productos</div>
                    </>
                )}
                <div>
                    Ordenar por:{''}
                    <select
                        className="margen-iz-1"
                        value={order}
                        onChange={(e) => {
                            props.history.push(getFilterUrl({ order: e.target.value }));
                        }}
                    >
                        <option value="newest">Nuevos Productos</option>
                        <option value="lowest">Precio: Menor a Mayor</option>
                        <option value="highest">Precio: Mayor a Menor</option>
                        <option value="toprated">Reseña de clientes</option>
                    </select>
                </div>
            </div>
            <div className="row top">
                <div className="col-1 col-categoria">
                    <h3 className="mayusculas">Categoría</h3>
                    <div>
                        {loadingCategories ? (
                            <LoadingBox></LoadingBox>
                        ) : errorCategories ? (
                            <MessageBox variant="danger">{errorCategories}</MessageBox>
                        ) : (
                            <ul>
                                <li className="fz-15">
                                    <a
                                        className={'all' === categoria ? 'color-primario' : 'color-negro'}
                                        href={getFilterUrl({ categoria: 'all' })}
                                    >
                                        Todo
                                    </a>
                                </li>
                                {categories.map((c) => (
                                    <li key={c}>
                                        <a
                                            className={c === categoria ? 'color-primario' : 'color-negro'}
                                            href={getFilterUrl({ categoria: c })}
                                        >
                                            {c}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h3 className="mayusculas">Precio</h3>
                        <ul>
                            {prices.map((p) => (
                                <li className="fz-15" key={p.name}>
                                    <a
                                        href={getFilterUrl({ min: p.min, max: p.max })}
                                        className={
                                            `${p.min}-${p.max}` === `${min}-${max}` ? 'color-primario' : 'color-negro'
                                        }
                                    >
                                        {p.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Reseña de clientes</h3>
                        <ul>
                            {ratings.map((r) => (
                                <li key={r.name}>
                                    <a
                                        href={getFilterUrl({ rating: r.rating })}
                                        className={`${r.rating}` === `${rating}` ? 'active' : ''}
                                    >
                                        <Rating caption={" & más"} rating={r.rating}></Rating>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-3 ">
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                            {productos.length === 0 && (
                                <MessageBox>No se encontró el producto</MessageBox>
                            )}
                            <div className="row center contenedor-search">
                                {productos.map((product) => (
                                    <Product key={product._id} product={product}></Product>
                                ))}
                            </div>
                            <div className="row center pagination">
                                {[...Array(pages).keys()].map((x) => (
                                    <a
                                        className={x + 1 === page ? 'active' : ''}
                                        key={x + 1} href={getFilterUrl({ page: x + 1 })}>
                                        {x + 1}
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
