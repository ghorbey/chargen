const express = require('express');
const database = require('../common/database');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/character';

element_get_all = (request, response) => {
    const query = `SELECT * FROM characters ORDER BY id`;
    database
        .executeQuery(query)
        .then(result => {
            response.send({ data: result.rows });
        });
};

element_get_one = (request, response) => {
    const { userId } = request.params;
    const values = [userId];
    const query = `SELECT * FROM characters WHERE user_id = $1`;
    database
        .executeQuery(query, values)
        .then(result => {
            let data = {};
            if (result && result.rowCount === 1) {
                const character = result.rows[0];
                data = { character };
            }
            response.send(data);
        });
};

element_add = (request, response) => {
    try {
        const { characterList } = request.body;
        const fields = 'user_id, character_name, character_type, character_number, fate_points, country_id, race_id, religion_id, vocation_id, current_xp, total_xp, public_legend, background';
        characterList.forEach(character => {
            const query = `INSERT INTO characters (${fields}) VALUES (
                ${character.user_id}, 
                '${character.character_name}', 
                '${character.character_type}', 
                '${character.character_number}', 
                ${character.fate_points}, 
                ${character.country_id}, 
                ${character.race_id}, 
                ${character.religion_id}, 
                ${character.vocation_id}, 
                ${character.current_xp}, 
                ${character.total_xp}, 
                '${character.public_legend}', 
                '${character.background}')`;
            database
                .executeQuery(query)
                .then(result => {
                    let data = {};
                    if (result.rowCount === 1) {
                        data = { isSuccessful: true, message: '' };
                    } else {
                        data = { isSuccessful: false, message: 'Impossible de créer le personnage' };
                    }
                    response.send(data);
                })
                .catch(error => {
                    response.send({ isSuccessful: false, message: `Impossible de créer le personnage : ${error}` });
                });
        });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de créer le personnage : ${ex}` });
    }
};

element_update = (request, response) => {
    try {
        const elementList = request.params;
        const result = `NOT IMPLEMENTED: ${url} update ${elementList.length}`;
        response.send(response);
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de mettre à jour le personnage : ${ex}` });
    }
};

element_delete = (request, response) => {
    try {
        const { idList } = request.body;
        idList.forEach(id => {
            const values = [id];
            const query = `DELETE FROM characters WHERE id = $1`;
            database.executeQuery(query, values)
                .then(result => {
                    let data = { isSuccessful: true, message: '' };
                    response.send(data)
                });
        });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de supprimer le personnage : ${ex}` });
    }
};

router.get(`${url}/getAll`, auth, element_get_all);
router.get(`${url}/:userId`, auth, element_get_one);
router.post(`${url}/add`, auth, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;