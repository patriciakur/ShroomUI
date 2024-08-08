const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const bcrypt = require('bcrypt');
const pool = require('./Backend/routes/creds');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, POST",
    TargetOrigin: "http://localhost:4200",
    credentials: true,
    
};


app.use(cors(corsOptions)); //Enables Cross-Origin Resource Sharing, allowing resources to be requested from a different domain
app.use(express.json()); // to support JSON-
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser()); //Parse Cookie header and populate req.cookies with an object keyed by the cookie names

//configures Express middleware to serve static files (such as HTML, CSS, images, etc.) from a directory named public
app.use(express.static(__dirname + '/Backend/public')); 

// Start at shroomUI.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/Backend/public/shroomUI.html");
})



app.get('/private', (req, res) => {
    const sessionToken = req.cookies["session_token"];

    if (!sessionToken) {
        return res.status(401).send();
    }

    const currentUserSession = sessions[sessionToken];

    if (!currentUserSession) {
        return res.status(401).send();
    }

    if (currentUserSession.expiresAt < new Date()) {
        return res.status(401).send();
    }

    console.log("currentUserSession", currentUserSession);
    const currentUser = users.find(user => user.name === currentUserSession.username);


    res.send("Welcome to the private area");
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
            //add cookie to db and return to user
            let sessionToken = uuid.v4();
            let unixTime= new Date().setFullYear(new Date().getFullYear() + 1); //makes expiration date 1 year from now
            let expiresAt = new Date(unixTime); //converts to date object

            //add session to db
            await pool.query(`INSERT INTO sessions ("sessionToken", username, "expiryTime") VALUES ($1, $2, $3) RETURNING *`, [sessionToken, req.body.name, expiresAt]);
            res.json(JSON.stringify({
                sessionToken: sessionToken,
                expiresAt: expiresAt
            }));
            console.log("User created")
            res.status(201).send()
            
        }
    }
    catch {
        res.status(500).send()
    }
})
app.post('/users/login', async (req, res) => {
    const user = await pool.query('SELECT * FROM users WHERE email=$1', [req.body.email]);
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.rows[0].password)){
            //add cookie to db and return to user
            let sessionToken = uuid.v4();
            let unixTime= new Date().setFullYear(new Date().getFullYear() + 1); //makes expiration date 1 year from now
            let expiresAt = new Date(unixTime); //converts to date object

            //add session to db
            await pool.query(`INSERT INTO sessions ("sessionToken", username, "expiryTime") VALUES ($1, $2, $3) RETURNING *`, [sessionToken, user.rows[0].username, expiresAt]);
            console.log("enter3")
            res.json(JSON.stringify({
                sessionToken: sessionToken,
                expiresAt: expiresAt
            }));
            res.status(201).send()
        } else {
            res.send('Not Allowed')
        }
    } catch {
        console.log("enter4")
        res.status(500).send()
    }
})

// ShroomUI backend
const submitToDBRouter = require( './Backend/routes/submitToDB' );
const { Target } = require('puppeteer');
app.use("/submitToDB", submitToDBRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))