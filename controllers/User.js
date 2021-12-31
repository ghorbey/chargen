const express = require('express');
const router = express.Router();
const MD5 = require("crypto-js/md5");

const database = require('../common/database');

const url = '/api/user';

generateToken = (id, password) => {
    return MD5(`${id}_${password}`).toString();
};

login = (req, res) => {
    // Validate input
    const { email, password } = req.body;
    if (!email || !password) {
        console.log(`Input data not valid!`);
        res.send({ token: null });
        return;
    }
    const query = `SELECT id, user_password FROM users WHERE email = $1 AND user_password = $2`;
    const values = [req.body.email, req.body.password];
    database
        .executeQuery(query, values)
        .then(result => {
            // User login successful
            if (result.rowCount === 1) {
                console.log(`Login successful for user '${email}'`);
                const { user_password, id } = result.rows[0];
                const token = generateToken(id, user_password);
                res.send({ token });
            } else {
                console.log(`Login unsuccessful for user '${email}'`);
                res.send({ token: null });
            }
        });
};

element_get_all = (req, res) => {
    const fakeData = [
        { id: '1', userName: 'Steph' },
        { id: '2', userName: 'Fred' }
    ];
    res.send(fakeData);
};

element_get_one = (req, res) => {
    const fakeData = { id: '1', userId: 1, userName: 'Steph' };
    res.send(fakeData);
};

element_add = (req, res) => {
    const elementList = req.params;
    const response = `NOT IMPLEMENTED: ${url} add ${elementList.length}`;
    res.send(response);
};

element_update = (req, res) => {
    const elementList = req.params;
    const response = `NOT IMPLEMENTED: ${url} update ${elementList.length}`;
    res.send(response);
};

element_delete = (req, res) => {
    const elementList = req.params;
    const response = `NOT IMPLEMENTED: ${url} delete ${elementList.length}`;
    res.send(response);
};

router.post(`${url}/login`, login);
router.get(`${url}/getAll`, element_get_all);
router.get(`${url}/:id`, element_get_one);
router.post(`${url}/add`, element_add);
router.post(`${url}/update`, element_update);
router.post(`${url}/delete`, element_delete);

module.exports = router;