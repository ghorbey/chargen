const pool = require('./pool');

const database = {
    executeQuery: (query) => {
        return pool.connect()
            .then(client => {
                return client.query(query)
                    .then(response => {
                        client.end();
                        return response;
                    })
                    .catch(error => console.warn(error));
            });
    },
    executeQuery: (query, values) => {
        return pool.connect()
            .then(client => {
                return client.query(query, values)
                    .then(response => {
                        client.end();
                        return response;
                    })
                    .catch(error => console.warn(error));
            });
    }
};

module.exports = database;