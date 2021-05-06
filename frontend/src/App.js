// IMPORTACION DE MODULOS
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
// IMPORTACION DE ACCIONES
//import { listProductCategories } from './actions/productActions';
import { signout } from './actions/userActions';
// IMPORTACIONES DE COMPONENTES
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import SearchBox from './components/SearchBox';
// IMPORTACION DE RUTAS PERSONALIZADAS
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
// IMPORTACION DE PANTALLAS
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LaEmpresaScreen from './screens/LaEmpresaScreen';
import MapScreen from './screens/MapScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserListScreen from './screens/UserListScreen';
import UbicacionScreen from './screens/UbicacionScreen';
import ContactoScreen from './screens/ContactoScreen';
import CrearProductoScreen from './screens/CrearProductoScreen';
// IMPORTACION DE ICONOS FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faChevronUp, faClock, faMapMarkerAlt, faPhoneSquareAlt, faUser } from '../node_modules/@fortawesome/free-solid-svg-icons/index';
import { faFacebookF, faInstagram, faWhatsapp } from '../node_modules/@fortawesome/free-brands-svg-icons/index';
import MarcaScreen from './screens/MarcaScreen';
import { listarMarcas } from './actions/marcaActions';
import Marca from './components/Marcas'
import CrearMarcaScreen from './screens/CrearMarcaScreen';
import { listProductCategories } from './actions/productActions';

function App() {
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();

    const signoutHandler = () => {
        dispatch(signout());
    };

    const productCategoryList = useSelector((state) => state.productCategoryList);
    const {
        loading: loadingCategories,
        error: errorCategories,
        categorias,
    } = productCategoryList;

    const marcaListar = useSelector((state => state.marcaListar));
    const { loading, error, marcas } = marcaListar;


    useEffect(() => {
        dispatch(listProductCategories());
        dispatch(listarMarcas())
    }, [dispatch]);

    window.onload = function () {
        navegacionFija();

        function navegacionFija() {

            const barra = document.querySelector('.header')
            const barra2 = document.querySelector('.logo-Buscador')

            // Registrar el Intersection Observer
            const observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    barra.classList.remove('fijo');
                    barra2.classList.remove('fijo2');
                } else {
                    barra.classList.add('fijo');
                    barra2.classList.add('fijo2');
                }
            })

            // Elemento a Observar
            observer.observe(document.querySelector('.categorias'));
        }

        // Scroll up, botón para volver al inicio 
        document.querySelector('#boton-up').addEventListener('click', scrollUp);

        function scrollUp() {

            let currentScroll = document.documentElement.scrollTop;

            if (currentScroll > 0) {
                window.requestAnimationFrame(scrollUp)
                window.scrollTo(0, currentScroll - (currentScroll / 10));
                buttonUp.style.transform = "scale(0)";
            }
        }

        const buttonUp = document.querySelector('#boton-up');

        window.onscroll = function () {
            let scroll = document.documentElement.scrollTop;

            if (scroll > 250) {
                buttonUp.style.transform = "scale(1)";
            } else if (scroll < 250) {
                buttonUp.style.transform = "scale(0)";
                buttonUp.style.transition = "all 0.3s ease"
            }
        }
    }

    return (
        <BrowserRouter>
            <div className="grid-container">
                <div className="header">
                    <header className="contenedor2">
                        <nav className="menu-desplegable fz-15">
                            <div className="encabezado ">
                                <div className="grid-column">
                                    <div>
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        <a
                                            href="/la-empresa">La Empresa</a>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <a
                                            href="/ubicacion">Dónde Estamos</a>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faClock} />
                                        <a
                                            href="/#">Lunes a Viernes de 07:30 a 18:00 Sábado de 07:30 a 12:00</a>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faPhoneSquareAlt} />
                                        <a
                                            href="/contacto">Atención al cliente</a>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div>
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                        <a href="/cart">
                                            Carrito
                                            {cartItems.length > 0 && (
                                                <span className="badge">{cartItems.length}</span>
                                            )}
                                        </a>
                                    </div>

                                    <div>
                                        {userInfo ? (
                                            <div className="dropdown">
                                                <Link to="#">
                                                    {userInfo.nombre} <i className="fa fa-caret-down"></i>{' '}
                                                </Link>
                                                <ul className="dropdown-content">
                                                    <li>
                                                        <a href="/profile">Perfil de usuario</a>
                                                    </li>
                                                    <li>
                                                        <a href="/orderhistory">Historial de pedidos</a>
                                                    </li>
                                                    <li>
                                                        <a href="#signout" onClick={signoutHandler}>
                                                            Cerrar sesión
                                                    </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        ) : (
                                            <p></p>
                                        )}
                                    </div>
                                    <div >
                                        {userInfo && userInfo.is_admin && (
                                            <div className="dropdown">
                                                <Link to="#admin">
                                                    Admin <i className="fa fa-caret-down"></i>
                                                </Link>
                                                <ul className="dropdown-content">
                                                    <li>
                                                        <a href="/dashboard">Dashboard</a>
                                                    </li>
                                                    <li>
                                                        <a href="/productlist">Productos</a>
                                                    </li>
                                                    <li>
                                                        <a href="/orderlist">Pedidos</a>
                                                    </li>
                                                    <li>
                                                        <a href="/userlist">Usuarios</a>
                                                    </li>
                                                    <li>
                                                        <a href="/crearmarca">Crear Marcas</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </nav>
                    </header>
                    <div className="logo-Buscador">
                        <div>
                            <a href="/">
                                <div className="logo-apolo">
                                    <img alt="" />
                                </div>
                            </a>
                        </div>
                        <div>
                            <Route
                                render={({ history }) => <SearchBox history={history}></SearchBox>}
                            ></Route>
                        </div>
                        {userInfo ? (
                            <div></div>
                        ) : (
                            <div className="margen-iz-11 display-f">
                                <FontAwesomeIcon className="user-background color-blanco" icon={faUser} />
                                <a href="/signin">
                                    <span className="margen-iz-1 color-negro"> Crear cuenta o Ingresar</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="categorias">
                    <div className="categorias-contenedor categorias__dropdown">
                        <a href={`/search/name/`} className="fa fa-bars barra margen-iz-2">
                        </a>
                        <ul className="categorias__dropdown--content">
                            {loadingCategories ? (
                                <LoadingBox></LoadingBox>
                            ) : errorCategories ? (
                                <MessageBox variant="danger">{errorCategories}</MessageBox>
                            ) : (
                                categorias.map((c) => (
                                    <li key={c.categoria}>
                                        <a className="menu-categorias"
                                            href={`/search/category/${c.categoria}`}
                                        >
                                            {c.categoria}
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <div className="nuestras-Marcas--dropdown">
                        <p className="negrita">Nuestras Marcas</p>
                        <ul >
                            <li>
                                {loading ? (
                                    <LoadingBox></LoadingBox>
                                ) : error ? (
                                    <MessageBox variant="danger">{error}</MessageBox>
                                ) : (
                                    <>
                                        <div className="nuestras-Marcas__contenido ">
                                            {marcas.map((marca) => (
                                                <Marca key={marca.cod_marca} marca={marca}></Marca>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </li>
                        </ul>
                    </div>
                    <div className="nuevos-lanzamientos">
                        <p className="negrita">Lanzamientos</p>
                    </div>
                    <div className="nuevos-lanzamientos">
                        <p className="negrita">Ofertas/Promociones</p>
                    </div>
                </div>

                <main>
                    <Route path="/marca/:id" component={MarcaScreen} exact></Route>
                    <Route path="/marca/:id/pageNumber/:pageNumber" component={MarcaScreen} exact></Route>
                    <Route path="/cart/:id?" component={CartScreen}></Route>
                    <Route path="/product/:id" component={ProductScreen} exact></Route>
                    <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
                    <Route path="/signin" component={SigninScreen}></Route>
                    <Route path="/register" component={RegisterScreen}></Route>
                    <Route path="/shipping" component={ShippingAddressScreen}></Route>
                    <Route path="/payment" component={PaymentMethodScreen}></Route>
                    <Route path="/placeorder" component={PlaceOrderScreen}></Route>
                    <Route path="/order/:id" component={OrderScreen}></Route>
                    <Route path="/orderhistory" component={OrderHistoryScreen} exact></Route>
                    <Route path="/orderhistory/pageNumber/:pageNumber" component={OrderHistoryScreen} exact></Route>
                    <Route path="/la-empresa" component={LaEmpresaScreen}></Route>
                    <Route path="/ubicacion" component={UbicacionScreen}></Route>
                    <Route path="/contacto" component={ContactoScreen}></Route>
                    <Route
                        path="/search/name/:name?"
                        component={SearchScreen}
                        exact
                    ></Route>
                    <Route
                        path="/search/category/:category"
                        component={SearchScreen}
                        exact
                    ></Route>
                    <Route
                        path="/search/category/:category/name/:name"
                        component={SearchScreen}
                        exact
                    ></Route>
                    <Route
                        path="/search/subCategory/:subCategory"
                        component={SearchScreen}
                        exact
                    ></Route>
                    <Route
                        path="/search/subCategory/:subCategory/name/:name"
                        component={SearchScreen}
                        exact
                    ></Route>
                    <Route
                        path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
                        component={SearchScreen}
                        exact
                    ></Route>
                    <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
                    <PrivateRoute path="/map" component={MapScreen}></PrivateRoute>
                    <AdminRoute path="/crearmarca" component={CrearMarcaScreen} exact></AdminRoute>
                    <AdminRoute path="/crearproducto" component={CrearProductoScreen} ></AdminRoute>
                    <AdminRoute path="/productlist" component={ProductListScreen} exact></AdminRoute>
                    <AdminRoute path="/productlist/pageNumber/:pageNumber" component={ProductListScreen} exact></AdminRoute>
                    <AdminRoute path="/orderlist" component={OrderListScreen} exact></AdminRoute>
                    <AdminRoute path="/orderlist/pageNumber/:pageNumber" component={OrderListScreen} exact></AdminRoute>
                    <AdminRoute path="/userlist" component={UserListScreen} exact></AdminRoute>
                    <AdminRoute path="/userlist/pageNumber/:pageNumber" component={UserListScreen} exact></AdminRoute>
                    <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
                    <Route path="/" component={HomeScreen} exact></Route>
                </main>
                <section className="seccion-inferior">
                    <div className="contenedor-inferior">
                        <div className="alinearPie texto-direccion">
                            <a href="/">
                                <div className="logo-apolo-2">
                                    <img alt="" />
                                </div>
                            </a>
                            <div>
                                <h3>Ciudad Del Este</h3>
                                <p>Ruta PY 02, KM 13.</p>
                            </div>
                            <div>
                                <h3>Encarnación</h3>
                                <p>Horacio Gonzalez 1429.</p>
                            </div>
                            <div>
                                <h3>Villa Elisa</h3>
                                <p className="mw-15">Río Salado 316 y Río Montelindo.</p>
                            </div>
                            <nav>
                                <h3>SÍGUENOS</h3>
                                <a
                                    className="icono"
                                    href="https://www.facebook.com/ApoloImportSA/"
                                    target="_blank"
                                    rel="noreferrer">
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a
                                    className="icono"
                                    href="https://www.instagram.com/apoloimport.py/"
                                    target="_blank"
                                    rel="noreferrer">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                            </nav>
                        </div>
                        <div className="texto-ley">
                            <p>Sitio web adaptado a la ley N° 4868/13 de Comercio Electrónico - Decreto Reglamentario N° 1165/2014 </p>
                            <p>Ley N° 1334 Defensa al Consumidor - Autoridad de Aplicación: Ministerio de Industria y Comercio - www.mic.gov.py</p>
                        </div>
                    </div>
                </section>

                <div className="social">
                    <a href="https://api.whatsapp.com/send?phone=595972810000&text=
                            Hola%20vengo%20de%20la%20web%20de%20compras%20y%20quiero%20
                            comunicarme%20con%20atenci%C3%B3n%20al%20cliente%20de%20Apolo" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon className="color-blanco" icon={faWhatsapp} />
                    </a>
                    <div className="etiqueta-whats">
                        <a href="https://api.whatsapp.com/send?phone=595972810000&text=
                            Hola%20vengo%20de%20la%20web%20de%20compras%20y%20quiero%20
                            comunicarme%20con%20atenci%C3%B3n%20al%20cliente%20de%20Apolo" target="_blank" rel="noreferrer">Whatsapp</a>
                    </div>
                </div>
                {/** Botón ir hacia arriba **/}
                <div id="boton-up" className="boton-up">
                    <FontAwesomeIcon icon={faChevronUp} />
                </div>

                <div className="nav-bg ">
                    <footer className="contenedor-footer">
                        <p className="copyright">APOLO IMPORT S.A. Todos los derechos reservados &copy;</p>
                    </footer>
                </div>
            </div>
        </BrowserRouter >
    );
}
export default App;