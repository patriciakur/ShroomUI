const express = require("express");
const router = express.Router();
const pool = require('./creds');

//Update IP address to the IP address of the robot
const ip = "172.27.34.74";

router.post('/', async (req, res) => {
    let { requestPath, data, needsStatusCheck } = req.body;
    let newPath = "http://" + ip + requestPath;
    try {
        let infoToSubmit = await pool.query(`INSERT INTO requests ("requestPath", "requestBody", "requestStatusCheck") VALUES ($1,  $2, $3) RETURNING *`, [newPath, data , needsStatusCheck]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    let mostRecentStatus = await pool.query(`SELECT * FROM statuses WHERE "statusResponseID" = (SELECT MAX("statusResponseID") FROM statuses);`);
    res.json(mostRecentStatus);
});



module.exports = router;

