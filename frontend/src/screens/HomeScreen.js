import React, { useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../components/Products';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { useDispatch, useSelector } from 'react-redux';
import { productoList } from '../actions/productActions';
import { listarMarcas, listTopMarcas } from '../actions/marcaActions';
import { Link, useParams } from 'react-router-dom';
import Marcas from '../components/Marcas';

export default function HomeScreen(props) {
    const { pageNumber = 1 } = useParams();
    const productId = props.match.params.id;
    const dispatch = useDispatch();

    const marcaListar = useSelector((state => state.marcaListar));
    const {
        loading: loadingMarcas,
        error: errorMarcas,
        marcas } = marcaListar;

    const productList = useSelector((state => state.productList));
    const { loading, error, productos, } = productList;

    const marcaTopList = useSelector((state) => state.marcaTopList);
    const {
        loading: loadingTopMarcas,
        error: errorTopMarcas,
        marcas: marcasTop
    } = marcaTopList;

    useEffect(() => {
        dispatch(productoList());
        dispatch(listTopMarcas());
        dispatch(listarMarcas());
    }, [dispatch, pageNumber, productId]);

    //va de la mano con el carrucel alice, no estoy muy seguro de que hace
    const handleDragStart = (e) => e.preventDefault();

    //Esta línea de código hace que nuestro carrusel sea responsivo, 
    const responsive = {
        0: { items: 2 }, // en 0 tendrá 1 item en pantalla
        568: { items: 3 },
        1024: { items: 6 }, // en 1024px tendrá 6 elementos en pantalla
    };

    const responsive2 = {
        0: { items: 2 },
        568: { items: 3 },
        1024: { items: 4 },
    }

    //En esta línea de código definimos los items a usar.
    //CARRUSEL NUESTRAS MARCAS
    const items = [];

    return (
        <div>
            <div>
                {loadingTopMarcas ? (
                    <LoadingBox></LoadingBox>
                ) : errorTopMarcas ? (
                    <MessageBox variant="danger">{errorTopMarcas}</MessageBox>
                ) : (
                    <>
                        {marcasTop.length === 0 && <MessageBox>Vendedor no encontrado</MessageBox>}
                        <Carousel showArrows autoPlay dynamicHeight
                            infiniteLoop showThumbs={false} showStatus={false}>
                            {marcasTop.map((marca) => (
                                <div key={marca.cod_marca}>
                                    <Link to={`/marca/${marca.cod_marca}`}>
                                        <p className="margen-cero">
                                            <img src={marca.imagen}
                                                alt={marca.imagen} />
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </Carousel>
                    </>
                )}
            </div>
            <div className="margen-total">
                <h2 className="subtitulos">Nuestras Marcas</h2>
                <div className="contenedor">
                    {loadingMarcas ? (
                        <LoadingBox></LoadingBox>
                    ) : errorMarcas ? (
                        <MessageBox variant="danger">{errorMarcas}</MessageBox>
                    ) : (
                        //En esta línea de código definimos el carrusel junto con sus propiedades,
                        //los items y el responsive
                        <>
                            <AliceCarousel
                                mouseTracking
                                items={items}
                                responsive={responsive}>
                                {marcas.map((marca) => (
                                    <div key={marca.nombre} className="alice-carrusel">
                                        <Marcas
                                            marca={marca}
                                            onDragStart={handleDragStart}
                                        ></Marcas>
                                    </div>
                                ))}
                            </AliceCarousel>
                        </>
                    )}
                </div>
            </div>

            <div>
                {/* Sección Universos */}
                <ul className="imagenes-universo contenedor">
                    <li>
                        <a href={`/search/category/Cuidado Facial y Corporal`}>
                            <img src="../images/U1.jpg" alt="Universo perfumeria" className="imagen-universo" />
                        </a>
                    </li>
                    <li >
                        <a href={`/search/category/Cafe`}>
                            <img src="../images/U3.jpg" alt="Universo cafe" className="imagen-universo" />
                        </a>
                    </li>
                    <li>
                        <a href={`/search/category/Bebidas con alcohol`}>
                            <img src="../images/U4.jpg" alt="Universo vinos" className="imagen-universo" />
                        </a>
                    </li>
                    <li>
                        <a href="/search/category/Reposteria y Panaderia">
                            <img src="../images/U2.jpg" alt="Universo reposteria" className="imagen-universo" />
                        </a>
                    </li>
                    <li>
                        <a href="/search/category/Pañales y Toallitas Humedas">
                            <img src="../images/U5.jpg" alt="Universo bebe" className="imagen-universo" />
                        </a>
                    </li>
                    <li>
                        <a href={`/search/category/Atomatados`}>
                            <img src="../images/U6.jpg" alt="Universo chef" className="imagen-universo" />
                        </a>
                    </li>
                </ul>
                <h2 className="subtitulos"> Productos Destacados</h2>
                <div className="contenedor">
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                            <AliceCarousel
                                disableDotsControls="true"
                                autoPlay
                                infinite
                                autoPlayInterval="1500"
                                mouseTracking items={items}
                                responsive={responsive2}>
                                {productos.map((product) => (
                                    < div key={product.cod_articulo} className="row center" >
                                        { productos.length === 0 && <MessageBox>Producto no encontrado</MessageBox>}
                                        <Product product={product}></Product>
                                    </div>
                                ))}
                            </AliceCarousel>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
}
