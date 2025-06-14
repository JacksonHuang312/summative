import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CartView.css";
import { useStoreContext } from "../context";
import { Map } from 'immutable';

function CartView() {
    const { cart, updateCart, handleCheckout, purchaseHistory, user } = useStoreContext();
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [validatedCart, setValidatedCart] = useState(cart);

    useEffect(() => {
        const newValidatedCart = cart.filter((value, key) => {
            const movieId = parseInt(key);
            return !purchaseHistory.some(purchase => 
                Object.values(purchase.items).some(item => item.id === movieId)
            );
        });
        
        setValidatedCart(newValidatedCart);
        if (!Map.isMap(newValidatedCart) || newValidatedCart.size !== cart.size) {
            updateCart(newValidatedCart);
        }
    }, [cart, purchaseHistory]);

    const handleRemoveFromCart = (movieId) => {
        if (!user) return;
        
        const newCart = validatedCart.delete(movieId.toString());
        updateCart(newCart);
    };

    const processCheckout = async () => {
        if (validatedCart.size === 0) {
            setCheckoutMessage("Your cart is empty!");
            return;
        }

        setProcessing(true);
        const success = await handleCheckout();
        setProcessing(false);

        if (success) {
            setCheckoutMessage("Thank you for your purchase! Enjoy your movies!");
        } else {
            setCheckoutMessage("There was an error processing your purchase. Please try again.");
        }

        setTimeout(() => setCheckoutMessage(''), 5000);
    };

    const cartItems = Array.from(validatedCart.values());

    return (
        <div className="cart-view">
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">Shopping Cart</h1>
                
                {checkoutMessage && (
                    <div className={`checkout-message ${checkoutMessage.includes('error') ? 'error' : 'success'}`}>
                        {checkoutMessage}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <p className="empty-cart">Your cart is empty</p>
                ) : (
                    <>
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
                        <button 
                            className="checkout-button" 
                            onClick={processCheckout}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Checkout'}
                        </button>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default CartView;