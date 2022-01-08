import decodeToken from './decodeToken';

export default function getCurrentUser() {
    const tokenString = sessionStorage.getItem('token');
    if (!tokenString) {
        return false;
    }
    const userToken = JSON.parse(tokenString);
    const currentUser = decodeToken(userToken);
    return currentUser;
}