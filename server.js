const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
require("dotenv").config()

// Connecting to Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.log(error.message)
    }
    console.log('connected to database')
})
db.get("PRAGMA foreign_keys = ON");


//CORS middleware
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(express.json()) //middleware

//rest api end points
app.get('/', (request, response) => {
    response.json({ info: 'Getting Info' })
})


app.listen(process.env.PORT, () => {
    console.log(`App live at http://localhost:${process.env.PORT}`)
})  