const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../common/knexConfig');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/user';

generateToken = (id, email, is_admin, user_firstname, user_lastname, is_pnj) => {
    const token = jwt.sign(
        {
            userId: id,
            userEmail: email,
            userName: `${user_firstname} ${user_lastname}`,
            isAdmin: is_admin,
            isPnj: is_pnj
        },
        'RANDOM-TOKEN',
        { expiresIn: '24h' }
    );
    return token;
};

login = (request, response) => {
    // Validate input
    const { email, password } = request.body;
    if (!email || !password) {
        response.send({ token: null, message: `Veuillez fournir un nom d'utilisateur et un mot de passe` });
        return;
    }
    db.select('id', 'user_password', 'is_admin', 'user_firstname', 'user_lastname', 'is_pnj')
        .from('users')
        .where('email', '=', email)
        .then(result => {
            let data = {};
            if (result && result.length === 1) {
                console.log('user retrieved');
                const { user_password, id, is_admin, user_firstname, user_lastname, is_pnj } = result[0];
                if (user_password !== password) {
                    data = { token: null, message: 'Mot de passe invalide!' };
                } else {
                    const token = generateToken(id, email, is_admin, user_firstname, user_lastname, is_pnj);
                    data = { token, message: '' };
                }
            } else {
                data = { token: null, message: `L'utilisateur ${email} n'existe pas!` };
            }
            response.send(data);
        });
};

element_get_all = (request, response) => {
    db.select('*')
        .from('users')
        .then(results => {
            let data = {};
            if (results.length >= 1) {
                console.log('users retrieved');
                results.forEach(result => result.user_password = '');
                data = { data: results, isSuccessful: true, message: '' };
            } else {
                data = { data: [], isSuccessful: true, message: 'Aucun utilisateur existant' };
            }
            response.send(data);
        });
};

element_get = (request, response) => {
    try {
        const { id } = request.params;
        let query = undefined;
        console.log(`retrieve user ${id}`);
        query = db.select('*').from('users').where('id', '=', id);
        if (query) {
            Promise
                .resolve(query)
                .then(result => {
                    let data = {};
                    if (result.length > 0) {
                        console.log('user retrieved');
                        result[0].user_password = '';
                        data = { data: result[0], isSuccessful: true, message: '' };
                        response.send(data);
                    } else {
                        response.send({ isSuccessful: false, message: `L'utilisateur n'existe pas`, data: undefined });
                    }
                });
        } else {
            response.send({ data: undefined, isSuccessful: false, message: `Id d'utilisateur invalide` });
        }
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de récupérer l'utilisateur' : ${ex}`, data: undefined });
    }
};

element_add = (request, response) => {
    try {
        const { userList } = request.body;
        let rowsToInsert = [];
        userList.forEach(user => {
            console.log(`Add user ${user.user_firstname} ${user.user_lastname}`);
            const rowToInsert = {
                user_firstname: user.user_firstname,
                user_lastname: user.user_lastname,
                phone_number: user.phone_number,
                email: user.email,
                user_password: user.user_password,
                is_admin: user.is_admin,
                is_pnj: user.is_pnj
            }
            rowsToInsert.push(rowToInsert);
        });
        db('users')
            .insert(rowsToInsert)
            .then(results => {
                let data = {};
                if (results.rowCount === rowsToInsert.length) {
                    console.log('users added');
                    data = { isSuccessful: true, message: '' };
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                }
                response.send(data);
            })
            .catch(error => {
                response.send({ isSuccessful: false, message: `Impossible de créer l'utilisateur : ${error}` });
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de créer l'utilisateur : ${ex}` });
    }
};

element_update = (request, response) => {
    try {
        const { userList } = request.body;
        let rowsToUpdate = [];
        userList.forEach(user => {
            console.log(`Update user ${user.id}`);
            const data = {
                user_firstname: user.user_firstname,
                user_lastname: user.user_lastname,
                phone_number: user.phone_number,
                email: user.email,
                is_admin: user.is_admin,
                is_pnj: user.is_pnj
            };
            if (user.user_password) {
                data.user_password = user.user_password;
            }
            const rowToUpdate = db('users')
                .where('id', '=', user.id)
                .update(data);
            rowsToUpdate.push(rowToUpdate);
        });
        Promise.all(rowsToUpdate)
            .then(results => {
                let data = {};
                if (results.length === rowsToUpdate.length) {
                    console.log('users updated');
                    data = { isSuccessful: true, message: '' };
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                }
                response.send(data);
            })
            .catch(error => {
                response.send({ isSuccessful: false, message: `Impossible de mettre à jour l'utilisateur' : ${error}` });
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de mettre à jour l'utilisateur : ${ex}` });
    }
};

element_delete = (request, response) => {
    try {
        const { idList } = request.body;
        let rowsToDelete = [];
        idList.forEach(id => {
            console.log(`Delete user ${id}`);
            const rowToDelete = db('users')
                .where('id', '=', id)
                .del();
            rowsToDelete.push(rowToDelete);
        });
        Promise.all(rowsToDelete)
            .then(results => {
                let data = {};
                if (results.length === rowsToDelete.length) {
                    console.log('users deleted');
                    data = { isSuccessful: true, message: '' };
                } else {
                    data = { isSuccessful: false, message: 'Erreur' };
                }
                response.send(data);
            });
    }
    catch (ex) {
        console.error(ex);
        response.send({ isSuccessful: false, message: `Impossible de supprimer l'utilisateur' : ${ex}` });
    }
};

router.post(`${url}/login`, login);
router.get(`${url}/getAll`, auth, element_get_all);
router.get(`${url}/:id`, auth, element_get);
router.post(`${url}/add`, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;