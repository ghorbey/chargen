import RequestService from './Request.service';

const url = '/api/character';

const CharacterService = {
    getAll: () => {
        const callUrl = `${url}/getAll`;
        return RequestService.get(callUrl, true);
    },
    getOne: (id) => {
        const callUrl = `${url}/${id}`;
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

export default CharacterService;