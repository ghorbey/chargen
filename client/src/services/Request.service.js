import axios from 'axios';

const RequestService = {
    get: (url) => {
        return axios.get(url);
    },

    post: (url, body) => {
        return axios.post(url, body);
    }
};

export default RequestService;