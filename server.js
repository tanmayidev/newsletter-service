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

// Middlewares

// body parser
app.use(express.json()) 

//CORS 
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



//rest api end points
app.get('/', (req, res) => {
    res.json({ info: 'Nothing to see here. Proceed to /register' })
})

// Send admin_name, email, title 
app.post('/register', (req, res) => {
    res.json({ info: 'register endpoint' })
})

// Send email, name
app.post('/add-topics', (req, res) => {
    res.json({ info: 'add-topics endpoint' })
})

// Send publish_time, content_data, topic_id, email
app.post('/add-content', (req, res) => {
    res.json({ info: 'add-content endpoint' })
})

// Client's endpoint -> takes sub_email, topic
app.post('/:newsletter/subscribe', (req, res) => {
    const {newsletter} = req.params
    res.json({ info: `subscribe newsletter(${newsletter}) endpoint` })
})





// Server Config
app.listen(process.env.PORT, () => {
    console.log(`App live at http://localhost:${process.env.PORT}`)
})  