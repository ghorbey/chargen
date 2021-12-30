import RequestService from './Request.service';

const url = '/api/character';

const CharacterService = {
    getAll: () => {
        const callUrl = `${url}/getAll`;
        const res = RequestService.get(callUrl);
        console.log(res);
        return res;
    },
    getOne: (id) => {
        const callUrl = `${url}/${id}`;
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

export default CharacterService;