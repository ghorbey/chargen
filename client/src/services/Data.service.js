import RequestService from './Request.service';

const url = '/api/data';

const CharacterService = {
    getAll: () => {
        const callUrl = `${url}/getAll`;
        return RequestService.get(callUrl, true);
    }
};

export default CharacterService;