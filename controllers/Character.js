const express = require('express');
const router = express.Router();

const database = require('../common/database');

const url = '/api/character';

element_get_all = (req, res) => {
    const query = `SELECT * FROM characters ORDER BY id`;
    database.executeQuery(query)
        .then(result => {
            res.send(result.rows)
        });
};

element_get_one = (req, res) => {
    const query = `SELECT * FROM characters WHERE id = $id`;
    database.executeQuery(query)
        .then(result => res.send(result.rows));
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

router.get(`${url}/getAll`, element_get_all);
router.get(`${url}/:id`, element_get_one);
router.post(`${url}/add`, element_add);
router.post(`${url}/update`, element_update);
router.post(`${url}/delete`, element_delete);

module.exports = router;