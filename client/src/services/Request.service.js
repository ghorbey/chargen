import axios from 'axios';
import TokenService from './Token.service';

if (process.env.NODE_ENV !== 'production') {
    axios.defaults.baseURL = "http://localhost:5001";
}

const RequestService = {
    get: async (url, requireAuth) => {
        const token = TokenService.get();
        const config = {};
        if (requireAuth) {
            config.headers = {
                'Authorization': `Basic ${token}`
            }
        }
        return axios
            .get(url, config)
            .then(response => response.data)
            .catch(error => console.error(error));
    },
    post: async (url, body, requireAuth) => {
        const token = TokenService.get();
        const config = {};
        if (requireAuth) {
            config.headers = {
                'Authorization': `Basic ${token}`
            }
        }
        return axios
            .post(url, body, config)
            .then(response => response.data)
            .catch(error => console.error(error));
    }
};

export default RequestService;