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
        const character_skills = db.select('skills.*').from('characters_skills').innerJoin('skills', 'characters_skills.skill_id', 'skills.id').where('characters_skills.character_id', '=', id);
        const characters_personal_quests = db.select('*').from('characters_personal_quests').where('character_id', '=', id);
        const characters_chapters = db.select('*').from('characters_chapters').where('character_id', '=', id);
        const characters_annexes = db.select('*').from('characters_annexes').where('character_id', '=', id);
        let queries = [
            character_careers,
            character_skills,
            characters_personal_quests,
            characters_chapters,
            characters_annexes
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
                                    // character_careers
                                    const character_careers = results[0];
                                    // Get default career id based on vocation.
                                    characterDTO.current_career_id = (character_careers?.length > 0) ? character_careers.find(career => career.is_current) : 0;
                                    characterDTO.character_careers = (character_careers?.length > 0) ? character_careers.filter(career => !career.is_current) : [];
                                    // character_skills
                                    characterDTO.character_skills = (results[1]?.length > 0) ? results[1].map(skill => skill.id) : [];
                                    // character_personal_quests
                                    characterDTO.character_personal_quests = (results[2]?.length > 0) ? results[2] : [];
                                    // character_chapters
                                    characterDTO.character_chapters = (results[3]?.length > 0) ? results[3] : [];
                                    // character_annexes
                                    characterDTO.character_annexes = (results[4]?.length > 0) ? results[4] : [];
                                    console.log(characterDTO);
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
        const rowsToInsert = [];
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
                background: character.background,
                career_plan: character.career_plan
            }
            rowsToInsert.push(rowToInsert);
        });
        // ADD TRANSACTION
        db('characters')
            .returning('id')
            .insert(rowsToInsert)
            .then(results => {
                console.log(results);
                let data = {};
                const afterDelete = [];
                const afterInsert = [];
                if (results.rowCount === rowsToInsert.length) {
                    console.log('characters added');
                    results.forEach(result => {
                        const characterId = result[0];
                        afterDelete.push(db('characters_careers').where("id", "=", characterId).del());
                        afterDelete.push(db('characters_skills').where("id", "=", characterId).del());
                        afterDelete.push(db('character_personal_quests').where("id", "=", characterId).del());
                        afterDelete.push(db('character_chapters').where("id", "=", characterId).del());
                        afterDelete.push(db('character_annexes').where("id", "=", characterId).del());
                        characterList.forEach(character => {
                            character.character_careers.forEach(career => {
                                afterInsert.push(db('characters_careers').insert({ character_id: characterId, career_id: career.career_id, is_current: career.is_current }));
                            });
                            character.character_skills.forEach(skill => {
                                afterInsert.push(db('characters_skills').insert({ character_id: characterId, skill_id: skill }));
                            });
                            character.character_personal_quests.forEach(quest => {
                                afterInsert.push(db('characters_personal_quests').insert({ character_id: characterId, content: quest.content, is_completed: quest.is_completed }));
                            });
                            character.character_chapters.forEach(chapter => {
                                afterInsert.push(db('characters_chapters').insert({ character_id: characterId, content: chapter.content, is_completed: chapter.sort_order }));
                            });
                            character.character_annexes.forEach(annexe => {
                                afterInsert.push(db('characters_annexes').insert({ character_id: characterId, content: annexe }));
                            });
                        });
                    });
                    Promise.all(afterDelete).then(deleteResults => {
                        Promise.all(afterInsert).then(insertResults => {
                            data = { isSuccessful: true, message: '' };
                            response.send(data);
                        })
                    });
                    data = { isSuccessful: true, message: '' };
                    response.send(data);
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                    response.send(data);
                }
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
        const rowsToUpdate = [];
        const afterDelete = [];
        const afterInsert = [];
        characterList.forEach(character => {
            console.log(`Update character ${character.id} for user ${character.user_id}`);
            const rowToUpdate = db('characters')
                .returning('id')
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
                    background: character.background,
                    career_plan: character.career_plan
                });
            rowsToUpdate.push(rowToUpdate);
        });
        // ADD TRANSACTION
        Promise.all(rowsToUpdate)
            .then(results => {
                let data = {};
                if (results.length === rowsToUpdate.length) {
                    results.forEach(result => {
                        const characterId = result[0];
                        afterDelete.push(db('characters_careers').where('character_id', '=', characterId).del());
                        afterDelete.push(db('characters_skills').where('character_id', '=', characterId).del());
                        afterDelete.push(db('characters_personal_quests').where('character_id', '=', characterId).del());
                        afterDelete.push(db('characters_chapters').where('character_id', '=', characterId).del());
                        afterDelete.push(db('characters_annexes').where('character_id', '=', characterId).del());
                        afterDelete.forEach(q => console.log(q.toSQL().toNative()));
                        characterList.forEach(character => {
                            character.character_careers.forEach(career => {
                                afterInsert.push(db('characters_careers').insert({ character_id: characterId, career_id: career.career_id, is_current: career.is_current }));
                            });
                            character.character_skills.forEach(skill => {
                                afterInsert.push(db('characters_skills').insert({ character_id: characterId, skill_id: skill }));
                            });
                            character.character_personal_quests.forEach(quest => {
                                afterInsert.push(db('characters_personal_quests').insert({ character_id: characterId, content: quest.content, is_completed: quest.is_completed }));
                            });
                            character.character_chapters.forEach(chapter => {
                                afterInsert.push(db('characters_chapters').insert({ character_id: characterId, content: chapter.content, is_completed: chapter.sort_order }));
                            });
                            character.character_annexes.forEach(annexe => {
                                afterInsert.push(db('characters_annexes').insert({ character_id: characterId, content: annexe }));
                            });
                        });
                    });
                    Promise.all(afterDelete).then(deleteResults => {
                        console.log(deleteResults);
                        Promise.all(afterInsert).then(insertResults => {
                            //console.log(insertResults);
                            data = { isSuccessful: true, message: '' };
                            console.log('characters updated');
                            response.send(data);
                        })
                    });
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                    response.send(data);
                }
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
        const rowsToDelete = [];
        const beforeDelete = [];
        idList.forEach(id => {
            console.log(`Delete character ${id}`);
            beforeDelete.push(db('characters_careers').where("id", "=", id).del());
            beforeDelete.push(db('characters_skills').where("id", "=", id).del());
            beforeDelete.push(db('characters_personal_quests').where("id", "=", id).del());
            beforeDelete.push(db('characters_chapters').where("id", "=", id).del());
            beforeDelete.push(db('characters_annexes').where("id", "=", id).del());
            const rowToDelete = db('characters')
                .where('id', '=', id)
                .del();
            rowsToDelete.push(rowToDelete);
        });
        // ADD TRANSACTION
        Promise.all(beforeDelete)
            .then(beforeResults => {
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
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de supprimer le personnage : ${ex}` });
    }
};

get_default_career_id = (vocation_id) => {

};

router.get(`${url}/getAll`, auth, element_get_all);
router.get(`${url}/:id/:isUser`, auth, element_get);
router.post(`${url}/add`, auth, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;