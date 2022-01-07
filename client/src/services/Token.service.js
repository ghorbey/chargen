const TokenService = {
    get: () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    },
    set: async (userToken) => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
    }
};

export default TokenService;