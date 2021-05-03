import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import AliceCarousel from "../../node_modules/react-alice-carousel/lib/react-alice-carousel";
import { createReview, detailsProduct, listarProductosMarcas2, listarReviews } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Products";
import Rating from "../components/Rating";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productConstants";
import formatoPy from "../util";
//import formatoPy from "../util";

export default function ProductScreen(props) {
  const { pageNumber = 1 } = useParams();
  const dispatch = useDispatch();

  const productId = props.match.params.id;
  const marcaId = props.match.params.id;

  const [qty, setQty] = useState(1)
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, producto } = productDetails;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productList = useSelector((state => state.listarProductosPorMarca));
  const {
    loading: loadingProduct,
    error: errorProduct,
    productos
  } = productList;

  const reviewList = useSelector((state => state.listarReviews));
  const {
    loading: loadingReviews,
    error: errorReviews,
    reviews
  } = reviewList;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    if (successReviewCreate) {
      window.alert('Reseña enviada correctamente');
      setPuntuacion('');
      setComentario('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }

    dispatch(detailsProduct(productId));
    dispatch(listarProductosMarcas2({ articulo: productId }))
    dispatch(listarReviews({ articulo: productId }))
  }, [dispatch, productId, successReviewCreate, marcaId, pageNumber]);
  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (comentario && puntuacion) {
      dispatch(createReview(productId, { puntuacion, comentario, nombre: userInfo.nombre })
      );
    } else {
      alert('Por favor, ingrese un comentario y una puntuación');
    }
  }

  const handleDragStart = (e) => e.preventDefault();

  const responsive = {
    0: { items: 2 },
    568: { items: 3 },
    1024: { items: 4 },
  }

  const items = [];

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="row top margen altura">
            <div className="col-2">
              <img
                className="large"
                src={producto.imagen}
                alt={producto.nombre}
              ></img>
            </div>
            {userInfo ? (
              <>
                <div className="col-1">
                  <ul>
                    <li>
                      <h1>{producto.nombre}</h1>
                    </li>
                    <li>
                      <Rating
                        rating={producto.articulo_puntuacion}
                        numReviews={producto.nro_review}
                      ></Rating>
                    </li>
                    <li>Precio : Gs. {formatoPy(producto.precio)}</li>
                    <li>
                      Descripción:
                  <p>{producto.descripcion}</p>
                    </li>
                  </ul>
                </div>
                <div className="col-1">
                  <div className="card card-body">
                    <ul>
                      <li>
                        Marca{''}
                        <h3>
                          <a className="color-azul" href={`/marca/${producto.cod_marca}`}>
                            {producto.marca_nombre}
                          </a>
                        </h3>
                        <Rating
                          rating={producto.puntuacion_marca}
                          numReviews={producto.num_reviews}
                        ></Rating>
                      </li>
                      <li>
                        <div className="row">
                          <div>Precio:</div>
                          <div className="price">Gs {formatoPy(producto.precio)}</div>
                        </div>
                      </li>
                      <li>
                        <div className="row">
                          <div>Estado:</div>
                          <div>
                            {producto.stock > 0 ? (
                              <span className="success">En stock.</span>
                            ) : (
                              <span className="danger">No disponible.</span>
                            )}
                          </div>
                        </div>
                      </li>
                      {
                        producto.stock > 0 && (
                          <>
                            <li>
                              <div className="row">
                                <div>Cantidad:</div>
                                <div>
                                  <select value={qty} onChange={e => setQty(e.target.value)}>
                                    {
                                      [...Array(producto.stock).keys()].map(
                                        (x) => (
                                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        )
                                      )
                                    }
                                  </select>
                                </div>
                              </div>
                            </li>
                            <li>
                              <button
                                onClick={addToCartHandler}
                                className="primary block">Agregar al carrito.</button>
                            </li>
                          </>
                        )
                      }
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-1 margen-de-15">
                <h1>{producto.nombre}</h1>
                <p><span className="negrita">Atención:</span> Para poder verificar los
                <span className="negrita"> precios</span> y realizar su
                <span className="negrita"> pedido</span>,
                es necesario ser un cliente registrado. Para realizar el registro o
                identificarse, si ya es un cliente registrado, haga clic abajo:</p>
                <button className="primary width-38">
                  <a className="estilo-boton" href="/signin">Iniciar Sesión</a>
                </button>
              </div>
            )}
          </div>
          <h2 className="subtitulos margen-cero">Otros Productos</h2>
          <div className="contenedor">
            {loadingProduct ? (
              <LoadingBox></LoadingBox>
            ) : errorProduct ? (
              <MessageBox variant="danger">{errorProduct}</MessageBox>
            ) : (
              <>
                <AliceCarousel
                  disableDotsControls="true"
                  mouseTracking
                  items={items}
                  responsive={responsive}>
                  {productos.map((product) => (
                    <div key={product.cod_articulo} className="row center">
                      {productos.length === 0 && <MessageBox>Producto no encontrado</MessageBox>}
                      <Product
                        product={product}
                        onDragStart={handleDragStart}
                      ></Product>
                    </div>
                  ))}
                </AliceCarousel>
              </>
            )}
          </div>
          <div className="contenedor">
            <h2 id="reviews" className="padding-cero">Reseñas</h2>
            {producto.nro_review === 0 && (
              <MessageBox>No existe una reseña</MessageBox>)}
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
                        onChange={(e) => setPuntuacion(e.target.value)}>
                        <option value="">Selecciona...</option>
                        <option value="1">1- Pobre</option>
                        <option value="2">2- Justo</option>
                        <option value="3">3- Bueno</option>
                        <option value="4">4- Muy bueno</option>
                        <option value="5">5- Excelente</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Comentario</label>
                      <textarea
                        id="comment"
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
                    Por favor <a href="/signin">Inicie sesión</a> para escribir una reseña
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )
      }
    </div >
  );
}
