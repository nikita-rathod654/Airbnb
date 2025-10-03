import React, { createContext, useEffect, useState, useContext } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {
    let { serverUrl } = useContext(authDataContext);
    let [userData, setUserData] = useState(null);

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
            setUserData(result.data);
        } catch (error) {
            setUserData(null);
            // Optionally, show toast or UI feedback for 400/401 error
            console.log(error);
        }
    };

    useEffect(() => {
        getCurrentUser();
        // eslint-disable-next-line
    }, []);

    let value = {
        userData,
        setUserData,
        getCurrentUser
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext;