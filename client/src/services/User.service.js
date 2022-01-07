import RequestService from './Request.service';

const url = '/api/user';

const UserService = {
    login: (credentials) => {
        const callUrl = `${url}/login`;
        return RequestService.post(callUrl, credentials, false);
    },
    getAll: () => {
        const callUrl = `${url}/getAll`;
        return RequestService.get(callUrl, true);
    },
    getOne: (id) => {
        const callUrl = `${url}/get/${id}`;
        return RequestService.get(callUrl, true);
    },
    addOne: (element) => {
        return this.addMany(url, [element]);
    },
    addMany: (elementList) => {
        const callUrl = `${url}/add`;
        return RequestService.post(callUrl, elementList, true);
    },
    updateOne: (element) => {
        return this.updateMany(url, [element]);
    },
    updateMany: (elementList) => {
        const callUrl = `${url}/update`;
        return RequestService.post(callUrl, elementList, true);
    },
    deleteOne: (id) => {
        return this.deleteMany(url, [id]);
    },
    deleteMany: (idList) => {
        const callUrl = `${url}/delete`;
        return RequestService.post(callUrl, idList, true);
    }
};

export default UserService;