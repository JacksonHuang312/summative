import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { auth, firestore } from '../firebase';
import {
    onAuthStateChanged,
    updateProfile,
    EmailAuthProvider,
    updatePassword,
    reauthenticateWithCredential
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion
} from 'firebase/firestore';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [cart, setCart] = useState(Map());
    const [purchaseHistory, setPurchaseHistory] = useState([]);

    const updateUserData = async (updates) => {
        if (!user) return;
        
        try {
            const userDocRef = doc(firestore, "users", user.email);
            await setDoc(userDocRef, updates, { merge: true });
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    const getCartKey = (userEmail) => `cart-${userEmail}`;

    const loadCartFromStorage = (userEmail, userPurchaseHistory = []) => {
        try {
            const storedCart = localStorage.getItem(getCartKey(userEmail));
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                // Filter out any items that have been purchased
                const filteredCart = {};
                for (const [key, value] of Object.entries(parsedCart)) {
                    const movieId = parseInt(key);
                    const isPurchased = userPurchaseHistory.some(purchase => 
                        Object.values(purchase.items).some(item => item.id === movieId)
                    );
                    if (!isPurchased) {
                        filteredCart[key] = value;
                    }
                }
                return Map(filteredCart);
            }
        } catch (e) {
            console.error("Error loading cart from localStorage:", e);
        }
        return Map();
    };

    const saveCartToStorage = (cartData, userEmail) => {
        if (!userEmail) return;
        try {
            localStorage.setItem(getCartKey(userEmail), JSON.stringify(cartData.toJS()));
        } catch (e) {
            console.error("Error saving cart to localStorage:", e);
        }
    };

    const updateCart = (newCart) => {
        if (!user) return;
        
        // Validate that none of the items in the new cart have been purchased
        const validatedCart = newCart.filter((value, key) => {
            const movieId = parseInt(key);
            const isPurchased = purchaseHistory.some(purchase => 
                Object.values(purchase.items).some(item => item.id === movieId)
            );
            return !isPurchased;
        });

        setCart(validatedCart);
        saveCartToStorage(validatedCart, user.email);
    };

    const clearCart = () => {
        setCart(Map());
        if (user?.email) {
            localStorage.removeItem(getCartKey(user.email));
        }
    };

    const handleCheckout = async () => {
        if (!user || cart.size === 0) return false;

        try {
            const validatedCart = cart.filter((value, key) => {
                const movieId = parseInt(key);
                const isPurchased = purchaseHistory.some(purchase => 
                    Object.values(purchase.items).some(item => item.id === movieId)
                );
                return !isPurchased;
            });

            if (validatedCart.size === 0) {
                return false;
            }

            const userDocRef = doc(firestore, "users", user.email);
            const timestamp = new Date().toISOString();
            const purchase = {
                items: validatedCart.toJS(),
                timestamp,
                total: validatedCart.size
            };

            const newPurchaseHistory = [...purchaseHistory, purchase];
            await updateDoc(userDocRef, {
                purchases: newPurchaseHistory
            });
            setPurchaseHistory(newPurchaseHistory);
            clearCart();

            return true;
        } catch (error) {
            console.error("Error processing checkout:", error);
            return false;
        }
    };

    const updateUserProfile = async (updates) => {
        if (!user) return false;

        try {
            if (updates.newPassword && updates.currentPassword) {
                try {
                    // Create credentials with current password
                    const credential = EmailAuthProvider.credential(
                        user.email,
                        updates.currentPassword
                    );
                    // Reauthenticate user using the imported function
                    await reauthenticateWithCredential(user, credential);
                    // Update password
                    await updatePassword(user, updates.newPassword);
                } catch (error) {
                    // Propagate Firebase auth errors to be handled in the component
                    throw error;
                }
            }

            // Update display name if changed
            if (updates.firstName || updates.lastName) {
                const displayName = `${updates.firstName} ${updates.lastName}`.trim();
                await updateProfile(user, { displayName });
            }

            // Update user data in Firestore
            const userDocRef = doc(firestore, "users", user.email);
            await updateDoc(userDocRef, {
                firstName: updates.firstName || firstName,
                lastName: updates.lastName || lastName,
                genres: updates.genres || selectedGenres
            });

            if (updates.firstName) setFirstName(updates.firstName);
            if (updates.lastName) setLastName(updates.lastName);
            if (updates.genres) setSelectedGenres(updates.genres);

            return true;
        } catch (error) {
            // Propagate error to component for handling
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                setAuthLoading(true);
                
                // Clear existing data first
                clearCart();
                setSelectedGenres([]);
                setPurchaseHistory([]);
                setFirstName('');
                setLastName('');

                if (firebaseUser) {
                    // Only set user data if we have a valid Firebase user
                    const userDocRef = doc(firestore, "users", firebaseUser.email);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.data();

                    if (userData) {
                        setUser(firebaseUser);
                        setFirstName(userData.firstName || '');
                        setLastName(userData.lastName || '');
                        setSelectedGenres(userData.genres || []);
                        setPurchaseHistory(userData.purchases || []);

                        const savedCart = loadCartFromStorage(firebaseUser.email, userData.purchases || []);
                        setCart(savedCart);
                    }
                } else {
                    // If no Firebase user, ensure user is null
                    setUser(null);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                // Clear all data on error
                setUser(null);
                clearCart();
                setSelectedGenres([]);
                setPurchaseHistory([]);
                setFirstName('');
                setLastName('');
            } finally {
                setAuthLoading(false);
            }
        });

        return () => {
            unsubscribe();
            clearCart();
        };
    }, []);

    const contextValue = {
        // Auth
        user,
        setUser,
        authLoading,
        
        // User Profile
        firstName,
        setFirstName,
        lastName,
        setLastName,
        updateUserProfile,
        
        // Genres
        selectedGenres,
        setSelectedGenres,
        
        // Shopping
        cart,
        updateCart,
        handleCheckout,
        purchaseHistory,
        setPurchaseHistory
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
};