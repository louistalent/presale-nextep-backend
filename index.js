const express = require('express');
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
import * as path from 'path';


var privateKey = fs.readFileSync('./certs/presale.key', 'utf8');
var certificate = fs.readFileSync('./certs/presale.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };
const FRONTENDPATH = path.normalize(__dirname + './build')
app.use(express.static(FRONTENDPATH))
// db connect
require('./DB/mysql');

app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

const options = {
    key: fs.readFileSync('./certs/presale.key'),
    cert: fs.readFileSync('./certs/presale.crt')
};
// parse requests of content-type - application/json
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'html');
//Routes
app.use('/', require('./routes/router'));

app.get('/', (req, res) => {
    const filename = FRONTENDPATH + '/index.html'
    res.sendFile(filename);
})

const PORT = process.env.PORT || 8443;
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, console.log("Server has started at port " + PORT));

// app.listen(PORT, console.log("Server has started at port " + PORT))