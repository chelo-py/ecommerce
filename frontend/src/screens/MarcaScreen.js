import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { createReview, detailsMarca, listarReviewsMarca } from '../actions/marcaActions';
import { listarProductosMarcas } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Products';
import Rating from '../components/Rating';
import { MARCA_REVIEW_CREATE_RESET } from '../constants/marcaConstants';

export default function MarcaScreen(props) {
    const { pageNumber = 1 } = useParams();
    const marcaId = props.match.params.id

    const marcaDetails = useSelector(state => state.marcaDetails)
    const { loading, error, marca } = marcaDetails;

    const listarProductosMarca = useSelector(state => state.listarProductosMarca)
    const {
        loading: loadingProducts,
        error: errorProducts,
        productos,
        page,
        pages
    } = listarProductosMarca;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const marcaReviewCreate = useSelector((state) => state.marcaReviewCreate);
    const {
        loading: loadingReviewCreate,
        error: errorReviewCreate,
        success: successReviewCreate,
    } = marcaReviewCreate;

    const reviewList = useSelector((state => state.listarReviewsMarca));
    const {
        loading: loadingReviews,
        error: errorReviews,
        reviews
    } = reviewList;

    const [puntuacion, setPuntuacion] = useState('');
    const [comentario, setComentario] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        if (successReviewCreate) {
            window.alert('Reseña enviada exitosamente');
            setPuntuacion('');
            setComentario('');
            dispatch({ type: MARCA_REVIEW_CREATE_RESET });
        }
        dispatch(listarReviewsMarca({ marca: marcaId }));
        dispatch(detailsMarca(marcaId));
        dispatch(listarProductosMarcas({ marca: marcaId, pageNumber }));
    }, [dispatch, marcaId, successReviewCreate, pageNumber]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (comentario && puntuacion) {
            dispatch(
                createReview(marcaId, { puntuacion, comentario, nombre: userInfo.nombre })
            );
        } else {
            alert('Por favor comenta y puntua');
        }
    }

    return (
        <div className="row top contenedor margen">
            {loading ? <LoadingBox></LoadingBox>
                :
                error ? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    (
                        <>
                            <div className="col-1 margen">
                                <ul className="card card-body width">
                                    <li>
                                        <div className="row start">
                                            <div className="p-1">
                                                <img className="marca-img-chica"
                                                    src={marca.logo}
                                                    alt={marca.marca_nombre} />
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Rating
                                            rating={marca.marca_puntuacion}
                                            numReviews={marca.num_reviews}>
                                        </Rating>
                                    </li>
                                    <li>
                                        {marca.descripcion}
                                    </li>
                                </ul>
                            </div>
                            <div className="col-3 margen contenedor">
                                {loadingProducts ? <LoadingBox></LoadingBox>
                                    :
                                    errorProducts ? <MessageBox variant="danger">{errorProducts}</MessageBox>
                                        :
                                        (
                                            <>
                                                {productos.length === 0 && <MessageBox>No existen Productos</MessageBox>}
                                                <div className="row center">
                                                    {productos.map((product) => (
                                                        <Product key={product.cod_articulo} product={product}></Product>
                                                    ))}
                                                </div>
                                            </>
                                        )
                                }
                                <div className="row center pagination">
                                    {[...Array(pages).keys()].map((x) => (
                                        <a
                                            className={x + 1 === page ? 'active' : ''}
                                            key={x + 1}
                                            href={`/marca/${marca.cod_marca}/pageNumber/${x + 1}`}
                                        >
                                            {x + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="contenedor">
                                <h2 id="reviews" className="padding-cero"> Reseñas de la marca</h2>
                                {marca.num_reviews === 0 && (
                                    <MessageBox>No existen reseñas</MessageBox>)}
                                {loadingReviews ? (
                                    <LoadingBox></LoadingBox>
                                ) : errorReviews ? (
                                    <MessageBox variant="danger">{errorReviews}</MessageBox>
                                ) : (
                                    <ul>
                                        {reviews.map((review) => (
                                            <li key={review.cod_review}>
                                                <strong>{review.nombre}</strong>
                                                <Rating rating={review.puntuacion} caption=" "></Rating>
                                                <p>{review.fecha.substring(0, 10)}</p>
                                                <p>{review.comentario}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <ul>
                                    <li>
                                        {userInfo ? (
                                            <form className="form" onSubmit={submitHandler}>
                                                <div>
                                                    <h2>Escribe una reseña</h2>
                                                </div>
                                                <div>
                                                    <label htmlFor="rating">Puntuación</label>
                                                    <select
                                                        id="rating"
                                                        value={puntuacion}
                                                        onChange={(e) => setPuntuacion(e.target.value)}
                                                    >
                                                        <option value="">Selecciona...</option>
                                                        <option value="1">1- Pobre</option>
                                                        <option value="2">2- Justo</option>
                                                        <option value="3">3- Bueno</option>
                                                        <option value="4">4- Muy bueno</option>
                                                        <option value="5">5- Excelente</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="comentario">Comentario</label>
                                                    <textarea
                                                        id="comentario"
                                                        value={comentario}
                                                        onChange={(e) => setComentario(e.target.value)}>
                                                    </textarea>
                                                </div>
                                                <div>
                                                    <label />
                                                    <button className="primary" type="submit">
                                                        Enviar
                                                    </button>
                                                </div>
                                                <div>
                                                    {loadingReviewCreate && <LoadingBox></LoadingBox>}
                                                    {errorReviewCreate && (
                                                        <MessageBox variant="danger">
                                                            {errorReviewCreate}
                                                        </MessageBox>
                                                    )}
                                                </div>
                                            </form>
                                        ) : (
                                            <MessageBox>
                                                Por favor <Link href="/signin"> Inicie sesión</Link> para escribir una reseña
                                            </MessageBox>
                                        )}
                                    </li>
                                </ul>

                            </div>
                        </>
                    )
            }
        </div >
    )
}
