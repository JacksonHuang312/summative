import { createContext, useState, useContext } from "react";
import { Map } from 'immutable';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    //user info
    const [loggedIn, setLoggedIn] = useState(false);
    const [firstName, setFirst] = useState("");
    const [lastName, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //cart
    const [cart, setCart] = useState(Map());
    //genres
    const [selectedGenres, setSelected] = useState([]);
    const [currentGenre, setCurrentGenre] = useState([]);

    return (
        <StoreContext.Provider value={{
            cart, setCart,
            password, setPassword,
            email, setEmail,
            firstName, setFirst,
            lastName, setLast,
            selectedGenres, setSelected,
            currentGenre, setCurrentGenre,
            loggedIn, setLoggedIn
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}