import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('melixer_token'));

    useEffect(() => {
        const savedUser = localStorage.getItem('melixer_user');
        const savedToken = localStorage.getItem('melixer_token');
        if(savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        localStorage.setItem('melixer_user', JSON.stringify(userData));
        localStorage.setItem('melixer_token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem('melixer_user');
        localStorage.removeItem('melixer_token');
    };


    return (<AuthContext.Provider value={{user, token, login, logout}}> 
            {children}
    </AuthContext.Provider>)

};


export const useAuth = () => useContext(AuthContext);