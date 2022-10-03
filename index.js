const express = require('express');
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const appController = require('./controller/app');

var privateKey = fs.readFileSync('./certs/presale.key', 'utf8');
var certificate = fs.readFileSync('./certs/presale.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

// const FRONTENDPATH = path.normalize(__dirname + '/build')
app.use(express.static(path.join(__dirname, 'build/')));
// db connect
require('./DB/mysql');

app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

// const options = {
//     key: fs.readFileSync('./certs/presale.key'),
//     cert: fs.readFileSync('./certs/presale.crt')
// };
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('build', path.join(__dirname, 'build'))
app.set('view engine', 'html');

//Routes
app.use('/', appController);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});
const PORT = process.env.PORT || 443;
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, console.log("Server has started at port " + PORT));

// app.listen(PORT, "0.0.0.0", console.log("Server has started at port " + PORT))