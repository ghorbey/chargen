import RequestService from './Request.service';

const url = '/api/character';

const CharacterService = {
    getAll: () => {
        const callUrl = `${url}/getAll`;
        return RequestService.get(callUrl, true);
    },
    get: (id) => {
        const callUrl = `${url}/${id}`;
        return RequestService.get(callUrl, true);
    },
    getForUser: (userId) => {
        const callUrl = `${url}/user/${userId}`;
        return RequestService.get(callUrl, true);
    },
    add: (elementList) => {
        const callUrl = `${url}/add`;
        const data = { characterList: elementList };
        return RequestService.post(callUrl, data, true);
    },
    update: (elementList) => {
        const callUrl = `${url}/update`;
        const data = { characterList: elementList };
        return RequestService.post(callUrl, data, true);
    },
    delete: (idList) => {
        const callUrl = `${url}/delete`;
        const data = { idList };
        return RequestService.post(callUrl, data, true);
    }
};

export default CharacterService;