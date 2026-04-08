// Modified by SDLC Agent | 2026-04-08 | purely-wishlist-service-PURELY-23 | development
// Changes: Added WishlistButton (heart toggle) to each product card — US-007.
import './products.css'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import { useContext, useEffect, useState } from 'react';
import Loading from '../../components/loading/loading';
import Info from '../../components/info/info';
import ProductService from '../../api-service/product.service';
import CartContext from '../../contexts/cart.context';
import { AuthContext } from '../../contexts/auth.context';
import Footer from '../../components/footer/footer';
import { PLACEHOLDER_IMAGE } from '../../constants/images';
import WishlistButton from '../../components/wishlist/WishlistButton';

function Products() {

    const { category } = useParams();
    const location = useLocation();
    const { getAllCategories, getAllProducts, getProductsByCategory, isLoading, categories, products, error } = ProductService()

    useEffect(() => {
        getAllCategories()
        if (location.state) {
            getProductsByCategory(location.state.categoryId)
        } else {
            getAllProducts()
        }
    }, [category])

    return (
        <>
            <Header />
            {isLoading && <Loading />}
            {error && <Info message="Unable to display product right now. Try again later..." />}
            {!isLoading && !error && (
                <>
                    <CategoryWrapper category={category} categoryList={categories} />
                    <ProductsWrapper products={products} />
                </>
            )}
            <Footer />
        </>
    )
}

export default Products;


function CategoryWrapper({ category, categoryList }) {

    const navigate = useNavigate();

    const onSelect = (categoryName, categoryId) => {
        categoryId ?
            navigate(`/products/${categoryName}`, { state: { categoryId: categoryId } })
            :
            navigate(`/products/${categoryName}`)
    }

    return (
        <section className="category-wrapper">
            <div className="category-list">
                <div
                    className={category == "All" ? "category active" : "category"}
                    onClick={() => onSelect("All")}
                >
                    All
                </div>
                {
                    categoryList.map((cat) => {
                        return (
                            <div
                                className={category == cat.categoryName ? "category active" : "category"}
                                key={cat.id}
                                onClick={() => onSelect(cat.categoryName, cat.id)}
                            >
                                {cat.categoryName}
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}


function ProductsWrapper({ products }) {

    const { addItemToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext)
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onAddToCart = async (productId) => {
        if (!user) {
            navigate("/auth/login")
            return
        }
        setLoading(true)
        await addItemToCart(productId, 1)
        setLoading(false)
    }

    return (
        <section className="products-container">
            <div className='products-wrapper'>
                {
                    isLoading ? <Loading /> :
                        products.map((product) => {
                            return (
                                <div className='box' key={product.id}>
                                    {/* Wishlist heart toggle — positioned top-right of card */}
                                    <div className="product-actions">
                                        <WishlistButton productId={product.id} />
                                    </div>
                                    <img src={`${product.imageUrl}`} className="image" alt='product' onError={(e) => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = "true"; e.target.src = PLACEHOLDER_IMAGE; } }}></img>
                                    <div className='price' aria-label='image'>Rs. {product.price}</div>
                                    <div className='text-part'>
                                        <div className='name'>{product.productName}</div>
                                        <div className='description'>{product.description}</div>
                                    </div>
                                    <button
                                        onClick={() => onAddToCart(product.id)}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            )
                        })
                }
            </div>
        </section>
    )
}
