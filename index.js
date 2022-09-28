const express = require('express');
const app = express();
const cors = require('cors');
// db connect
require('./DB/mysql');

app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

// parse requests of content-type - application/json
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'html');
//Routes
app.use('/', require('./routes/router'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server has started at port " + PORT))