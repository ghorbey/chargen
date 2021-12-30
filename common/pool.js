require('dotenv').config()
const { Pool } = require("pg");
const env = process.env.NODE_ENV || 'development';

const isStaging = process.env.NODE_ENV === "staging";
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const poolConnectionString = isStaging || isProduction
    ? { connectionString: process.env.DATABASE_URL }
    : { connectionString: connectionString };

const pool = new Pool(poolConnectionString);

pool.on('error', err => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool;