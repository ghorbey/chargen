const { Pool } = require("pg");

let credentials = {
    user: "kufhjuotoojmev",
    host: "localhost",
    database: "d743i8seb04k2b",
    password: "ea95488de9cb28657b7cda1bf417d9e8d1b73302b84d5575ae44e66281bcfb06",
    port: 5432
};

if (process.env.NODE_ENV === 'production') {
    credentials.host = "ec2-52-31-201-170.eu-west-1.compute.amazonaws.com";
}

const pool = new Pool(credentials);

pool.on('error', err => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool;