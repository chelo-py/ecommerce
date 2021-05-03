import { useSelector } from 'react-redux';
import formatoPy from '../util';
import Rating from './Rating';

export default function Product(props) {

    const { product } = props;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    return (
        <div>
            <div key={product.cod_articulo} className="card">
                <a href={`/product/${product.cod_articulo}`}>
                    <img className="medium"
                        src={product.articulo_imagen}
                        alt={product.nombre}
                    />
                </a>
                {userInfo ? (
                    <div className="card-body-products">
                        <a href={`/product/${product.cod_articulo}`}>
                            <h2 className="salto-linea width-20 margen-cero">{product.nombre}</h2>
                        </a>
                        <Rating
                            rating={product.punt_articulo}
                            numReviews={product.review_articulo}>
                        </Rating>
                        <div className="row">
                            <div className="price">Gs. {formatoPy(product.precio)}</div>
                        </div>
                        <ul className="color-gris margen-iz-1">
                            <li>
                                <a className="color-gris" href={`/search/category/${product.categoria}`}>
                                    + {product.categoria}
                                </a>
                            </li>
                            <li className="margen-cero">
                                <a className="color-gris" href={`/marca/${product.codmarca}`}>
                                    + {product.marca}
                                </a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="card-body-products">
                        <a href={`/product/${product.cod_articulo}`}>
                            <h2 className="salto-linea margen-cero">{product.nombre}</h2>
                        </a>
                        <button className="margen-iz-1">
                            <a className="mayusculas estilo-boton2" href={`/product/${product.cod_articulo}`}>
                                Más Detalles
                            </a>
                        </button>
                        <ul className="color-gris margen-iz-1">
                            <li className="margen-top-2">
                                <a className="color-gris" href={`/search/category/${product.categoria}`}>
                                    + {product.categoria}
                                </a>
                            </li>
                            <li className="margen-cero">
                                <a className="color-gris" href={`/marca/${product.codmarca}`}>
                                    + {product.marca}
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}