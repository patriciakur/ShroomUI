const { Pool } = require('pg');

const pool = new Pool({
    "host": "", 
    "user": "",  
    "database": "",
    "password": "", 
    "port": 0,
    ssl: {
        rejectUnauthorized: false
    },
    credentials: 'include'
});

module.exports = pool;