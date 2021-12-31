import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        console.log(userToken);
        console.log(tokenString);
        return userToken?.token;
    };

    const [token, setToken] = useState(getToken());

    console.log(token);

    const saveToken = userToken => {
        console.log('saveToken');
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    }
}