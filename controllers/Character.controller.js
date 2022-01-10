const express = require('express');
const database = require('../common/database');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/character';

element_get_all = (request, response) => {
    try {
        console.log(`retrieve all characters`);
        const query = `SELECT * FROM characters ORDER BY character_name`;
        database
            .executeQuery(query)
            .then(result => {
                let data = {};
                if (result?.rowCount >= 1) {
                    data = { data: result.rows, isSuccessful: true, message: '' };
                } else {
                    data = { data: [], isSuccessful: true, message: 'Aucun personnage existant' };
                }
                response.send(data);
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de créer le personnage : ${ex}`, data: [] });
    }
};

element_get = (request, response) => {
    try {
        const { id } = request.params;
        if (+id > 0) {
            console.log(`retrieve character ${id}`);
            const values = [id];
            const query = `SELECT * FROM characters WHERE id = $1`;
            database
                .executeQuery(query, values)
                .then(result => {
                    let data = {};
                    if (result?.rowCount === 1) {
                        data = { data: result.rows[0], isSuccessful: true, message: '' };
                    } else {
                        data = { data: null, isSuccessful: true, message: 'Aucun personnage lié à cet utilisateur' };
                    }
                    response.send(data);
                });
        } else {
            response.send({ data: null, isSuccessful: false, message: 'Id de personnage invalide' });
        }
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de créer le personnage : ${ex}`, data: [] });
    }
};

element_get_for_user = (request, response) => {
    try {
        const { userId } = request.params;
        if (+userId > 0) {
            console.log(`retrieve character for user ${userId}`);
            const values = [userId];
            const query = `SELECT * FROM characters WHERE user_id = $1 LIMIT 1`;
            database
                .executeQuery(query, values)
                .then(result => {
                    let data = {};
                    if (result?.rowCount === 1) {
                        data = { data: result.rows[0], isSuccessful: true, message: '' };
                    } else {
                        data = { data: null, isSuccessful: true, message: 'Aucun personnage lié à cet utilisateur' };
                    }
                    response.send(data);
                });
        } else {
            response.send({ data: null, isSuccessful: false, message: 'Id de personnage invalide' });
        }
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de récupérer le personnage du joueur : ${ex}`, data: [] });
    }
};

element_add = (request, response) => {
    try {
        const { characterList } = request.body;
        const fields = 'user_id, character_name, character_type, character_number, fate_points, country_id, race_id, religion_id, vocation_id, current_xp, total_xp, public_legend, background';
        let queryList = [];
        characterList.forEach(character => {
            console.log(`Added character ${character.character_name} for user ${character.user_id}`);
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
                '${character.background}');`;
            queryList.push(query);
        });
        database
            .executeQueries(queryList.join(' '))
            .then(results => {
                let data = {};
                if (results.rowCount === queryList.length) {
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
        const fields = 'character_name, character_type, character_number, fate_points, country_id, race_id, religion_id, vocation_id, current_xp, total_xp, public_legend, background';
        let queryList = [];
        characterList.forEach(character => {
            console.log(`Updated character ${character.id} for user ${character.user_id}`);
            const query = `UPDATE characters SET 
                character_name = '${character.character_name}', 
                character_type = '${character.character_type}', 
                character_number ='${character.character_number}', 
                fate_points = ${character.fate_points}, 
                country_id = ${character.country_id}, 
                race_id = ${character.race_id}, 
                religion_id = ${character.religion_id}, 
                vocation_id = ${character.vocation_id}, 
                current_xp = ${character.current_xp}, 
                total_xp = ${character.total_xp}, 
                public_legend = '${character.public_legend}', 
                background = '${character.background}'
                WHERE id = ${character.id};`;
            queryList.push(query);
        });
        database
            .executeQueries(queryList.join(' '))
            .then(results => {
                let data = {};
                if (results.rowCount === queryList.length) {
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
        let queryList = [];
        idList.forEach(id => {
            console.log(`Delete character ${id}`);
            const query = `DELETE FROM characters WHERE id = ${id}`;
            queryList.push(query);
        });
        database.executeQuery(queryList.join(' '))
            .then(results => {
                let data = {};
                if (results.rowCount === queryList.length) {
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
router.get(`${url}/:id`, auth, element_get);
router.get(`${url}/user/:userId`, auth, element_get_for_user);
router.post(`${url}/add`, auth, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;