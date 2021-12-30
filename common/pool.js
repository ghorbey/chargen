const { Pool } = require("pg");
const env = process.env.NODE_ENV || 'development';

const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({ connectionString: isProduction ? process.env.DATABASE_URL : connectionString, ssl: { rejectUnauthorized: false } });

pool.on('error', err => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool;