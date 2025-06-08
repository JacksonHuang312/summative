import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { auth, firestore } from '../firebase';
import {
    onAuthStateChanged,
    updateProfile,
    EmailAuthProvider,
    updatePassword
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

    const saveCartToStorage = (cartData, userId) => {
        try {
            localStorage.setItem(`${userId}-cart`, JSON.stringify(cartData));
        } catch (e) {
            console.error("Error saving cart to localStorage:", e);
        }
    };

    const updateCart = (newCart, save = true) => {
        setCart(newCart);
        if (save && user) {
            saveCartToStorage(newCart.toJS(), user.uid);
        }
    };

    const handleCheckout = async () => {
        if (!user || cart.size === 0) return;

        try {
            const userDocRef = doc(firestore, "users", user.email);
            const timestamp = new Date().toISOString();
            const purchase = {
                items: cart.toJS(),
                timestamp,
                total: cart.size
            };

            await updateDoc(userDocRef, {
                purchases: arrayUnion(purchase)
            });
            setPurchaseHistory(prev => [...prev, purchase]);
            updateCart(Map(), true);

            return true;
        } catch (error) {
            console.error("Error processing checkout:", error);
            return false;
        }
    };

    const updateUserProfile = async (updates) => {
        if (!user) return;

        try {
            if (updates.firstName || updates.lastName) {
                const displayName = `${updates.firstName} ${updates.lastName}`.trim();
                await updateProfile(user, { displayName });
            }

            if (updates.newPassword) {
                await updatePassword(user, updates.newPassword);
            }

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
            console.error("Error updating profile:", error);
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const userDocRef = doc(firestore, "users", firebaseUser.email);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.data();

                    if (userData) {
                        setUser(firebaseUser);
                        setFirstName(userData.firstName || '');
                        setLastName(userData.lastName || '');
                        setSelectedGenres(userData.genres || []);
                        setPurchaseHistory(userData.purchases || []);

                        const storedCart = localStorage.getItem(`${firebaseUser.uid}-cart`);
                        if (storedCart) {
                            try {
                                const parsedCart = JSON.parse(storedCart);
                                updateCart(Map(parsedCart), false);
                            } catch (e) {
                                console.error("Error parsing stored cart:", e);
                            }
                        }
                    } else {
                        setUser(null);
                        setFirstName('');
                        setLastName('');
                        setSelectedGenres([]);
                    }
                } else {
                    setUser(null);
                    setFirstName('');
                    setLastName('');
                    setSelectedGenres([]);
                    setCart(Map());
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                setUser(null);
                setFirstName('');
                setLastName('');
                setSelectedGenres([]);
            } finally {
                setAuthLoading(false);
            }
        });

        return () => unsubscribe();
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