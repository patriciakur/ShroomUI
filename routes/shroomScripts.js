const express = require('express');
const pool = require('./creds');
const router = express.Router();

//Update IP address to the IP address of the robot
const ip = "172.27.34.61";

router.post('/', async (req, res) => {
    const { requestPath, requestBody, requestStatusCheck } = req.body;

    var infoToSubmit = await pool.query(`INSERT INTO requests (requestPath, requestBody, requestStatusCheck) VALUES ($1, $2, $3) RETURNING *`,
        [requestPath = "http://" + ip + requestPath, requestBody, requestStatusCheck]);
    res.json();

});

router.get('/', async (req, res) => {

    const mostRecentStatus = await pool.query(`SELECT * FROM statuses WHERE statusresponseid = (SELECT MAX(statusresponseid) FROM statuses);`);
    res.json(mostRecentStatus);
});

module.exports = router

