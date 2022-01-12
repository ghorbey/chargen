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
    get: (id) => {
        const callUrl = `${url}/${id}`;
        console.log(callUrl);
        return RequestService.get(callUrl, true);
    },
    add: (elementList) => {
        const callUrl = `${url}/add`;
        const data = { userList: elementList };
        return RequestService.post(callUrl, data, true);
    },
    update: (elementList) => {
        const callUrl = `${url}/update`;
        const data = { userList: elementList };
        return RequestService.post(callUrl, data, true);
    },
    delete: (idList) => {
        const callUrl = `${url}/delete`;
        const data = { idList };
        return RequestService.post(callUrl, data, true);
    }
};

export default UserService;