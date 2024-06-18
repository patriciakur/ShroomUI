const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000;

app.use(cors()); //Enables Cross-Origin Resource Sharing, allowing resources to be requested from a different domain
app.use(express.json()); // to support JSON-
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-

//configures Express middleware to serve static files (such as HTML, CSS, images, etc.) from a directory named public

app.use(express.static(__dirname + '/public')); 
