const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const pool = require('./Backend/routes/creds');
const bcrypt = require('bcrypt');

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, DELETE",
    TargetOrigin: "http://localhost:4200",
    credentials: true,
    
};


app.use(cors(corsOptions)); //Enables Cross-Origin Resource Sharing, allowing resources to be requested from a different domain
app.use(express.json()); // to support JSON-
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

//configures Express middleware to serve static files (such as HTML, CSS, images, etc.) from a directory named public
app.use(express.static(__dirname + '/Backend/public')); 

// Start at shroomUI.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/Backend/public/shroomUI.html");
})


app.post('/users', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        let checkIfUserExists = await pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)', [req.body.name]);

        if (checkIfUserExists.rows[0].exists) {
            // reject the creation
            res.status(500).send()
        }
        else{
            //create user
            await pool.query(`INSERT INTO users (username, password, email) VALUES ($1,  $2, $3) RETURNING *`, [req.body.name , hashedPassword, req.body.email]);
            const user = await pool.query('SELECT * FROM users WHERE username=$1', [req.body.name]);
            res.json(JSON.stringify({
                id: user.rows[0].userID
            }));

            res.status(201).send()
            
        }
    }
    catch {
        res.status(500).send()
    }
})
app.post('/users/login', async (req, res) => {
    const user = await pool.query('SELECT * FROM users WHERE username=$1', [req.body.username]);
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.rows[0].password)){
            res.json(JSON.stringify({
                id: user.rows[0].userID
            }));
            res.status(201).send()
        } else {
            console.log('Incorrect Password')
            res.send('Not Allowed')
        }
    } catch {
        console.log('Error')
        res.status(500).send()
    }
})

//const ip = "172.27.34.74";

app.post('/submitToDB', async (req, res) => {
    let { requestPath, data, needsStatusCheck, ip } = req.body;
    let newPath = "http://" + ip + requestPath;
    try {
        await pool.query(`INSERT INTO requests ("requestPath", "requestBody", "requestStatusCheck", "robotIP") VALUES ($1,  $2, $3, $4) RETURNING *`, [newPath, data , needsStatusCheck, ip]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/submitToDB/:bigDogIP', async (req, res) => {
    let mostRecentStatus = await pool.query(`SELECT * FROM statuses WHERE "robotIP" = $1 AND "statusResponseID" = (SELECT MAX("statusResponseID") FROM statuses);`, [req.params.bigDogIP]);
    res.json(mostRecentStatus);
});

app.get('/robotList/:userID', async (req, res) => {
    try {
        let robotList = await pool.query(`SELECT * FROM robots WHERE "userID" = $1`, [req.params.userID]);
        res.json(robotList);
    }
    catch {
        console.log('Error')
        res.status(500).send()
    }
});

app.post('/addRobot', async (req, res) => {
    console.log(req.body)
    req.body.robotName = req.body.robotName === '' ? null : req.body.robotName;
    req.body.bigDogIP = req.body.bigDogIP === '' ? null : bigDogIP;
    req.body.armIP= req.body.armIP === '' ? null : armIP;
    try {
        await pool.query(`INSERT INTO robots ("robotID", "robotName", "bigDogIP", "armIP", "userID") VALUES ($1, $2, $3, $4, $5) RETURNING *`, [req.body.robotID, req.body.robotName, req.body.bigDogIP, req.body.armIP , parseInt(req.body.userID)]);
        
        res.json(req.body);
        res.status(201).send()
    }
    catch {
        res.status(500).send()
    }
});
app.delete('/deleteRobot/:userID/:robotID', async (req, res) => {
    try {
        await pool.query(`DELETE FROM robots WHERE "robotID" = $1 AND "userID" = $2`, [req.params.robotID, req.params.userID]);
        res.json(req.params.robotID);
        res.status(200).send()
    }
    catch {
        res.status(500).send()
    }
});
app.put('/updateRobot', async (req, res) => {
    try {
        await pool.query(`UPDATE robots SET "robotName" = $1, "bigDogIP" = $2, "armIP" = $3 WHERE "robotID" = $4 AND "userID" = $5`, [req.body.robotName, req.body.bigDogIP, req.body.armIP, req.body.robotID, req.body.userID]);
        res.json(req.body); //needed to put some kinda response item b/c trying to update the put request in the frontend caused an error when trying to set the req body to the response
        res.status(200).send()
    }
    catch {
        res.status(500).send()
    }
});

app.put('/changeUsername', async (req, res) => {
    try {
        await pool.query(`UPDATE users SET "username" = $1 WHERE "userID" = $2`, [req.body.newUsername, req.body.userID]);
        res.json(req.body);
        res.status(200).send()
    }
    catch {
        res.status(500).send()
    }
})
app.put('/changeEmail', async (req, res) => {
    try {
        await pool.query(`UPDATE users SET "email" = $1 WHERE "userID" = $2`, [req.body.newEmail, req.body.userID]);
        res.json(req.body);
        res.status(200).send()
    }
    catch {
        res.status(500).send()
    }
})

app.put('/changePassword', async (req, res) => {
    try {
        let salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
        await pool.query(`UPDATE users SET "password" = $1 WHERE "userID" = $2`, [hashedPassword, req.body.userID]);
        res.json(JSON.stringify({
            user: req.body.userID
        }));
        res.status(200).send()
    }
    catch {
        res.status(500).send()
    }
})
app.post('/validatePassword', async (req, res) => {
    const currentPassword = await pool.query('SELECT * FROM users WHERE "userID"=$1', [req.body.userID]);
    console.log(currentPassword.rows[0].password)
    try {
        console.log(req.body.password)
        if(await bcrypt.compare(req.body.password, currentPassword.rows[0].password)){
            res.json(JSON.stringify({
                user: req.body.username
            }));
            res.status(201).send()
        } else {
            console.log('Incorrect Password')
            res.send('Not Allowed')
        }
    } catch {
        console.log('Error')
        res.status(500).send()
    }

})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))