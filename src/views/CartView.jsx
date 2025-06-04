import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CartView.css";

function CartView() {
    const { cart, setCart } = useStoreContext();

    const handleRemoveFromCart = (movieId) => {
        setCart(prevCart => {
            const newCart = new Map(prevCart);
            newCart.delete(movieId);
            return newCart;
        });
    };

    const cartItems = Array.from(cart.values());

    return (
        <div className="cart-view">
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p className="empty-cart">Your cart is empty</p>
                ) : (
                    <div className="cart-items">
                        {cartItems.map(movie => (
                            <div key={movie.id} className="cart-item">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                    className="cart-item-poster"
                                />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-title">{movie.title}</h3>
                                    <button
                                        className="remove-button"
                                        onClick={() => handleRemoveFromCart(movie.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default CartView;