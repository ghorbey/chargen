require('dotenv').config()
const { Pool } = require("pg");

const env = process.env.NODE_ENV || 'development';
const isProduction = env === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const poolConnectionString = isProduction
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : { connectionString: connectionString };

const pool = new Pool(poolConnectionString);

pool.on('error', err => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool;