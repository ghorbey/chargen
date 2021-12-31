import RequestService from './Request.service';

const url = '/api/user';

const UserService = {
    login: (credentials) => {
        const callUrl = `${url}/login`;
        return RequestService.post(callUrl, credentials);
    },
    getAll: () => {
        const callUrl = `${url}/getAll`;
        return RequestService.get(callUrl);
    },
    getOne: (id) => {
        const callUrl = `${url}/get/${id}`;
        return RequestService.get(callUrl);
    },
    addOne: (element) => {
        return this.addMany(url, [element]);
    },
    addMany: (elementList) => {
        const callUrl = `${url}/add`;
        return RequestService.post(callUrl, elementList);
    },
    updateOne: (element) => {
        return this.updateMany(url, [element]);
    },
    updateMany: (elementList) => {
        const callUrl = `${url}/update`;
        return RequestService.post(callUrl, elementList);
    },
    deleteOne: (id) => {
        return this.deleteMany(url, [id]);
    },
    deleteMany: (idList) => {
        const callUrl = `${url}/delete`;
        return RequestService.post(callUrl, idList);
    }
};

export default UserService;