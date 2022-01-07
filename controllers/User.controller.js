const express = require('express');
const sha256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');
const database = require('../common/database');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/user';

generateToken = (id, password) => {
    const token = jwt.sign(
        {
            userId: id,
            userEmail: password,
        },
        'RANDOM-TOKEN',
        { expiresIn: '24h' }
    );
    return token;
};

login = (request, response) => {
    // Validate input
    const { email, password } = request.body;
    console.log(request.body);
    if (!email || !password) {
        console.log(`Input data not valid!`);
        response.send({ token: null, message: `Veuillez fournir un nom d'utilisateur et un mot de passe` });
        return;
    }
    const query = `SELECT id, user_password FROM users WHERE email = $1`;
    const values = [request.body.email];
    database
        .executeQuery(query, values)
        .then(result => {
            if (result && result.rowCount === 1) {
                // User login successful
                const { user_password, id } = result.rows[0];
                if (user_password !== password) {
                    response.send({ token: null, message: 'Mot de passe invalide!' });
                } else {
                    console.log('Login successful');
                    const token = generateToken(id, user_password);
                    response.send({ token, message: '' });
                }
            } else {
                response.send({ token: null, message: `L'utilisateur ${email} n'existe pas!` });
            }
        });
};

element_get_all = (request, response) => {
    const fakeData = [
        { id: '1', userName: 'Steph' },
        { id: '2', userName: 'Fred' }
    ];
    response.send(fakeData);
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