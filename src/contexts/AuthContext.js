import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';

// wrap this context around the entire app, so all pages will know if the user is logged in or not
const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

/* This file contains all user authentication logic (login/logout/signup) */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password) => {
        return new Promise((res, rej) => {
            auth.createUserWithEmailAndPassword(email, password)
            .then((userCreds) => res(userCreds))
            .catch((reason) => rej(reason.message));
        });
    }

    const login = async (email, password) => {
        return new Promise((res, rej) => {
            auth.signInWithEmailAndPassword(email, password)
            .then((userCreds) => res(userCreds))
            .catch((reason) => rej(reason.message));
        });
    }

    const logout = () => {
        return auth.signOut();
    }

    const value = {
        currentUser,
        signup,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    );
};