import axios from 'axios';

if (process.env.NODE_ENV !== 'production') {
    axios.defaults.baseURL = "http://localhost:5000";
}

const RequestService = {
    get: (url) => {
        return axios.get(url)
            .then(response => response.data)
            .catch(error => console.error(error));
    },

    post: (url, body) => {
        return axios.post(url, body)
            .then(response => response.data)
            .catch(error => console.error(error));
    }
};

export default RequestService;