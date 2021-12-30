var express = require('express');
var router = express.Router();

const url = '/api/character';

element_get_all = (req, res) => {
    const fakeData = [
        { id: '1', userId: 1, characterName: 'Totof' },
        { id: '2', userId: 2, characterName: 'Titeuf' }
    ];
    res.send(fakeData);
};

element_get_one = (req, res) => {
    const fakeData = { id: '1', userId: 1, characterName: 'Totof' };
    res.send(fakeData);
};

element_add = (req, res) => {
    const elementList = req.params;
    const response = `NOT IMPLEMENTED: ${url} add ${req.params.length}`;
    res.send(response);
};

element_update = (req, res) => {
    const elementList = req.params;
    const response = `NOT IMPLEMENTED: ${url} update ${req.params.length}`;
    res.send(response);
};

element_delete = (req, res) => {
    const elementList = req.params;
    const response = `NOT IMPLEMENTED: ${url} delete ${req.params.length}`;
    res.send(response);
};

router.get(`${url}/getAll`, element_get_all);
router.get(`${url}/:id`, element_get_one);
router.post(`${url}/add`, element_add);
router.post(`${url}/update`, element_update);
router.post(`${url}/delete`, element_delete);

module.exports = router;