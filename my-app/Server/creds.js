const { Pool } = require('pg');

const pool = new Pool({
    "host": "shallowly-forbearing-bandicoot.data-1.use1.tembo.io", 
    "user": "postgres",  
    "database": "Mushroom",
    "password": "YRkedybSqhM0fHje", 
    "port": 5432,
    ssl: {
        rejectUnauthorized: false
    },
    credentials: 'include'
});

module.exports = pool;