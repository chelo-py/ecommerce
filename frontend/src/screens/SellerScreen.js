import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import { detailsUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Products';
import Rating from '../components/Rating';

export default function SellerScreen(props) {
    const { pageNumber = 1 } = useParams();
    const sellerId = props.match.params.id;
    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;
    const productList = useSelector(state => state.productList);
    const {
        loading: loadingProducts,
        error: errorProducts,
        products,
        page,
        pages,
    } = productList;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(detailsUser(sellerId));

        dispatch(listProducts({
            seller: sellerId,
            pageNumber,
        }));
    }, [dispatch, sellerId, pageNumber,]);
    return (
        <div className="row top">
            <div className="col-1 margen">
                {loading ? <LoadingBox></LoadingBox>
                    :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                        :
                        (
                            <ul className="card card-body width">
                                <li>
                                    <div className="row start">
                                        <div className="p-1">
                                            <img className="marca-img-chica"
                                                src={user.seller.logo}
                                                alt={user.seller.name} />
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Rating
                                        rating={user.seller.rating}
                                        numReviews={user.seller.numReviews}
                                    ></Rating>
                                </li>
                                <li>
                                    <a href={`mailto:${user.email}`}>Contacto Vendedor</a>
                                </li>
                                <li>
                                    {user.seller.description}
                                </li>
                            </ul>
                        )
                }
            </div>
            <div className="col-3 margen contenedor">
                {loadingProducts ? <LoadingBox></LoadingBox>
                    :
                    errorProducts ? <MessageBox variant="danger">{errorProducts}</MessageBox>
                        :
                        (
                            <>
                                {products.length === 0 && <MessageBox>Productos no encontrados</MessageBox>}
                                <div className="row center">
                                    {products.map((product) => (
                                        <Product key={product._id} product={product}></Product>
                                    ))}
                                </div>
                                <div className="row center pagination">
                                    {[...Array(pages).keys()].map((x) => (
                                        <Link
                                            className={x + 1 === page ? 'active' : ''}
                                            key={x + 1}
                                            to={`/seller/${user._id}/pageNumber/${x + 1}`}>
                                            {x + 1}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
            </div>
        </div >
    )
}
