const express = require('express');
const auth = require('./auth.controller');
const db = require('../common/knexConfig');

const router = express.Router();
const url = '/api/character';

element_get_all = (request, response) => {
    try {
        console.log(`retrieve all characters`);
        db.select('*')
            .from('characters')
            .orderBy('character_name')
            .then(results => {
                let data = {};
                console.log('characters retrieved');
                if (results.length >= 1) {
                    data = { data: results, isSuccessful: true, message: '' };
                } else {
                    data = { data: [], isSuccessful: true, message: 'Aucun personnage existant' };
                }
                response.send(data);
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de récupérer la liste des personnages : ${ex}`, data: [] });
    }
};

element_get = (request, response) => {
    try {
        const { id } = request.params;
        const isUser = request.params.isUser === 'true';
        let query = undefined;
        if (id > 0 && isUser) {
            console.log(`retrieve character for user ${id}`);
            query = db.select('*').from('characters').where('user_id', '=', id).limit(1);
        } else if (id > 0 && !isUser) {
            console.log(`retrieve character ${id}`);
            query = db.select('*').from('characters').where('id', '=', id);
        }
        const character_careers = db.select('careers.*', 'characters_careers.is_current as is_current').from('characters_careers').innerJoin('careers', 'characters_careers.career_id', 'careers.id').where('characters_careers.character_id', '=', id);
        let queries = [
            character_careers
        ];
        if (query) {
            Promise
                .resolve(query)
                .then(result => {
                    let data = {};
                    if (result) {
                        console.log('character retrieved');
                        let characterDTO = result[0];
                        if (characterDTO) {
                            Promise.all(queries)
                                .then(results => {
                                    characterDTO.careers_history = results[0];
                                    data = { data: characterDTO, isSuccessful: true, message: '' };
                                    response.send(data);
                                });
                        } else {
                            response.send({ isSuccessful: false, message: `Le personnage n'existe pas`, data: undefined });
                        }
                    } else {
                        data = { data: undefined, isSuccessful: true, message: 'Aucun personnage lié à cet utilisateur' };
                        response.send(data);
                    }
                });
        } else {
            response.send({ data: undefined, isSuccessful: false, message: 'Id de personnage invalide' });
        }
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de récupérer le personnage : ${ex}`, data: undefined });
    }
};

element_add = (request, response) => {
    try {
        const { characterList } = request.body;
        let rowsToInsert = [];
        // Check if add is allowed (Only 1 per PJ)
        characterList.forEach(character => {
            console.log(`Add character ${character.character_name} for user ${character.user_id}`);
            const rowToInsert = {
                user_id: character.user_id,
                character_name: character.character_name,
                character_type: character.character_type,
                character_number: character.character_number,
                fate_points: character.fate_points,
                country_id: character.country_id,
                race_id: character.race_id,
                religion_id: character.religion_id,
                vocation_id: character.vocation_id,
                current_xp: character.current_xp,
                total_xp: character.total_xp,
                public_legend: character.public_legend,
                background: character.background
            }
            rowsToInsert.push(rowToInsert);
        });
        db('characters')
            .insert(rowsToInsert)
            .then(results => {
                let data = {};
                if (results.rowCount === rowsToInsert.length) {
                    console.log('characters added');
                    data = { isSuccessful: true, message: '' };
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                }
                response.send(data);
            })
            .catch(error => {
                response.send({ isSuccessful: false, message: `Impossible de créer le personnage : ${error}` });
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de créer le personnage : ${ex}` });
    }
};

element_update = (request, response) => {
    try {
        const { characterList } = request.body;
        let rowsToUpdate = [];
        characterList.forEach(character => {
            console.log(`Update character ${character.id} for user ${character.user_id}`);
            const rowToUpdate = db('characters')
                .where('id', character.id)
                .update({
                    character_name: character.character_name,
                    character_type: character.character_type,
                    character_number: character.character_number,
                    fate_points: character.fate_points,
                    country_id: character.country_id,
                    race_id: character.race_id,
                    religion_id: character.religion_id,
                    vocation_id: character.vocation_id,
                    current_xp: character.current_xp,
                    total_xp: character.total_xp,
                    public_legend: character.public_legend,
                    background: character.background
                });
            rowsToUpdate.push(rowToUpdate);
        });
        Promise.all(rowsToUpdate)
            .then(results => {
                let data = {};
                if (results.length === rowsToUpdate.length) {
                    console.log('characters updated');
                    data = { isSuccessful: true, message: '' };
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                }
                response.send(data);
            })
            .catch(error => {
                response.send({ isSuccessful: false, message: `Impossible de mettre à jour le personnage : ${error}` });
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de mettre à jour le personnage : ${ex}` });
    }
};

element_delete = (request, response) => {
    try {
        const { idList } = request.body;
        let rowsToDelete = [];
        idList.forEach(id => {
            console.log(`Delete character ${id}`);
            const rowToDelete = db('characters')
                .where('id', '=', id)
                .del();
            rowsToDelete.push(rowToDelete);
        });
        Promise.all(rowsToDelete)
            .then(results => {
                let data = {};
                if (results.length === rowsToDelete.length) {
                    console.log('characters deleted');
                    data = { isSuccessful: true, message: '' };
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                }
                response.send(data);
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de supprimer le personnage : ${ex}` });
    }
};

router.get(`${url}/getAll`, auth, element_get_all);
router.get(`${url}/:id/:isUser`, auth, element_get);
router.post(`${url}/add`, auth, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;