const express = require('express');
const database = require('../common/database');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/character';

element_get_all = (request, response) => {
    const query = `SELECT * FROM characters ORDER BY id`;
    database.executeQuery(query)
        .then(result => {
            response.send({ data: result.rows });
        });
};

element_get_one = (request, response) => {
    const query = `SELECT * FROM characters WHERE id = $id`;
    database.executeQuery(query)
        .then(result => response.send(result.rows));
};

element_add = (request, response) => {
    const query = `INSERT INTO characters VALUES ()`;
    database.executeQuery(query)
        .then(result => response.send(result.rows));
};

element_update = (request, response) => {
    const elementList = request.params;
    const result = `NOT IMPLEMENTED: ${url} update ${elementList.length}`;
    response.send(response);
};

element_delete = (request, response) => {
    const query = `DELETE FROM characters WHERE id = $id`;
    database.executeQuery(query)
        .then(result => res.send(result.rows));
};

router.get(`${url}/getAll`, auth, element_get_all);
router.get(`${url}/:id`, auth, element_get_one);
router.post(`${url}/add`, auth, element_add);
router.post(`${url}/update`, auth, element_update);
router.post(`${url}/delete`, auth, element_delete);

module.exports = router;