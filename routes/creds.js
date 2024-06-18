const { Pool } = require('pg');

const pool = new Pool({
    "host": "shallowly-forbearing-bandicoot.data-1.use1.tembo.io", //postgreSQL DB 
    "user": "postgres",  //Insert your database username here
    "database": "Mushroom", //Insert what database you want to access here
    "password": "YRkedybSqhM0fHje", //Insert your db password
    "port": 5432
});

module.exports = pool;