const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../common/knexConfig');
const database = require('../common/knexConfig');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/user';

generateToken = (id, email, is_admin, user_firstname, user_lastname) => {
    const token = jwt.sign(
        {
            userId: id,
            userEmail: email,
            userName: `${user_firstname} ${user_lastname}`,
            isAdmin: is_admin
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
    db.select('id', 'user_password', 'is_admin', 'user_firstname', 'user_lastname')
        .from('users')
        .where('email', '=', email)
        .then(result => {
            let data = {};
            if (result && result.length === 1) {
                const { user_password, id, is_admin, user_firstname, user_lastname } = result[0];
                if (user_password !== password) {
                    data = { token: null, message: 'Mot de passe invalide!' };
                } else {
                    const token = generateToken(id, email, is_admin, user_firstname, user_lastname);
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
        .then(result => {
            let data = {};
            if (result) {
                const { user_password, id, is_admin, user_firstname, user_lastname } = result.rows[0];
                if (user_password !== password) {
                    data = { token: null, message: 'Mot de passe invalide!' };
                } else {
                    const token = generateToken(id, email, is_admin, user_firstname, user_lastname);
                    data = { token, message: '' };
                }
            } else {
                data = { token: null, message: `L'utilisateur ${email} n'existe pas!` };
            }
            response.send(data);
        });
};

element_get_one = (request, response) => {
    const fakeData = { id: '1', userId: 1, userName: 'Steph' };
    response.send(fakeData);
};

element_add = (request, response) => {
    const elementList = request.params;
    const result = `NOT IMPLEMENTED: ${url} add ${elementList.length}`;
    response.send(result);
};

element_update = (request, response) => {
    const elementList = request.params;
    const result = `NOT IMPLEMENTED: ${url} update ${elementList.length}`;
    response.send(result);
};

element_delete = (request, response) => {
    const elementList = request.params;
    const result = `NOT IMPLEMENTED: ${url} delete ${elementList.length}`;
    response.send(result);
};

router.post(`${url}/login`, login);
router.get(`${url}/getAll`, auth, element_get_all);
router.get(`${url}/:id`, auth, element_get_one);
router.post(`${url}/add`, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;