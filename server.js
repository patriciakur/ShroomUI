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
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = JSON.stringify({name: req.body.name, password:hashedPassword, email:req.body.email})

        let checkIfUserExists = false //await pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)', [req.body.name]);
        
        if (checkIfUserExists) { //.rows[0].exists
            // reject the creation
            console.log("User already exists")
        }
        else{
            //create user
            await pool.query(`INSERT INTO users (username, password, email) VALUES ($1,  $2, $3) RETURNING *`, [req.body.name , hashedPassword, req.body.email]);
            //add cookie to db and return to user
            let sessionToken = uuid.v4();
            let unixTime= new Date().setFullYear(new Date().getFullYear() + 1); //makes expiration date 1 year from now
            let expiresAt = new Date(unixTime); //converts to date object

            //add session to db
            await pool.query(`INSERT INTO sessions ("sessionToken", username, "expiryTime4") VALUES ($1, $2, $3) RETURNING *`, [sessionToken, req.body.name, expiresAt]);
            
            res.cookie('sessionToken', sessionToken, {maxAge: expiresAt})
            
        }
    }
    catch {
        res.status(500).send()
    }
})
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
            //add cookie to db and return to user
            let sessionToken = uuid.v4();
            let unixTime= new Date().setFullYear(new Date().getFullYear() + 1); //makes expiration date 1 year from now
            let expiresAt = new Date(unixTime); //converts to date object

            //add session to db
            await pool.query(`INSERT INTO sessions ("sessionToken", username, "expiryTime4") VALUES ($1, $2, $3) RETURNING *`, [sessionToken, req.body.name, expiresAt]);
            
            res.cookie('sessionToken', sessionToken, {maxAge: expiresAt})
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

// ShroomUI backend
const submitToDBRouter = require( './Backend/routes/submitToDB' )
app.use("/submitToDB", submitToDBRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))