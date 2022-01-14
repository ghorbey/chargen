const express = require('express');
const db = require('../common/knexConfig');
const auth = require('./auth.controller');

const router = express.Router();
const url = '/api/data';

get_all = (request, response) => {
    try {
        console.log(`retrieve all data`);
        const selects = [
            db.select('*').from('vocations').orderBy('id'),
            db.select('*').from('skills').orderBy('id'),
            db.select('*').from('religions').orderBy('id'),
            db.select('*').from('races').orderBy('id'),
            db.select('*').from('countries').orderBy('id'),
            db.select('*').from('careers').orderBy('id'),
            db.select('*').from('careers_skills'),
            db.select('*').from('races_skills')
        ];
        Promise
            .all(selects)
            .then(results => {
                let data = {};
                if (results.length === selects.length) {
                    console.log(`data retrieved ${new Date()}`);
                    const vocations = results[0];
                    const skills = results[1];
                    const religions = results[2];
                    const races = results[3];
                    const countries = results[4];
                    const careers = results[5];
                    const careers_skills = results[6];
                    const races_skills = results[7];
                    data = { data: { vocations, skills, religions, races, countries, careers, careers_skills, races_skills }, isSuccessful: true, message: '' };
                } else {
                    console.log('Problème lors de la récupération des données');
                    data = { data: [], isSuccessful: false, message: 'Problème lors de la récupération des données' };
                }
                response.send(data);
            });
    }
    catch (ex) {
        console.log('Problème lors de la récupération des données');
        console.error(ex);
        response.send({ isSuccessful: false, message: `Problème lors de la récupération des données : ${ex}`, data: {} });
    }
};

router.get(`${url}/getAll`, auth, get_all);

module.exports = router;