require('dotenv').config()
const knex = require('knex');

const env = process.env.NODE_ENV || 'development';
const isProduction = env === "production";
const pgConnectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const connectionString = isProduction
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : { connectionString: pgConnectionString };

const db = knex({
    client: 'pg',
    connection: connectionString,
    searchPath: ['knex', 'public']
});

module.exports = db;