const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const schedule = require('node-schedule')
const nodemailer = require('nodemailer')
require("dotenv").config()

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_ID,
      pass: process.env.PASSWORD
    }
  });

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
    // capture arguments
    const { admin_name, email, title } = req.body

    // check whether admin already exists in db
    db.get(`SELECT admin_id FROM ADMIN WHERE email = (?)`, [email], (err, data) => {

        if (err) {
            res.status(400).send("USER ALREADY EXISTS")
        }

        else {

            // if admin does not exist in db, add admin to db
            if (data === undefined) {
                db.run(`INSERT INTO ADMIN (admin_name, email, title) VALUES (?,?,?)`, [admin_name, email, title], (err) => {
                    if (err) {
                        res.status(500).send("ERROR WHILE INSERTING, PLEASE TRY AGAIN!")
                    }
                    else {
                        res.status(200).send("ADMIN SUCCESSFULLY ADDED!")
                    }
                });
            }
            else {
                res.status(400).send(`USER ALREADY EXISTS`)
            }
        }
    });
})

// Send email, name
app.post('/add-topics', (req, res) => {

    // capture arguments
    const { email, name } = req.body

    // check whether admin exists in db
    db.get(`SELECT admin_id FROM ADMIN WHERE email = (?)`, [email], (err, data) => {
        if (err) {
            res.status(500).send("UNEXPECTED ERROR, TRY AGAIN PLEASE")
        }
        else {
            if (data === undefined) {
                res.status(401).send("UNAUTHORIZED ACCESS, REGISTER FIRST!")
            }
            else {

                // check if (topic,admin) already exists in db
                db.get(`SELECT topic_id FROM TOPICS WHERE admin_id=(?) AND name=(?)`, [data.admin_id, name], (err, res_data) => {
                    if (err) {
                        res.status(500).send("UNEXPECTED ERROR, TRY AGAIN PLEASE")
                    }
                    else {
                        if (res_data === undefined) {

                            // insert (topic, admin_id) into db
                            db.run(`INSERT INTO TOPICS (name, admin_id) VALUES (?,?)`, [name, data.admin_id], (err) => {
                                if (err) {
                                    res.status(500).send("ERROR WHILE INSERTING, PLEASE TRY AGAIN!")
                                }
                                else {
                                    res.status(200).send(`TOPIC ${name} ADDED SUCCESSFULLY FOR USER ${email}`)
                                }
                            });
                        }
                        else {
                            res.status(400).send(`TOPIC ${name} ALREADY EXISTS FOR USER ${email}`)
                        }
                    }
                })
            }
        }
    });
})

// Send publish_time, content_data, topic_id, email
// publish_time format: String(YYYY,MM,DD,Hrs,Min,Secs) -> "2022,4,6,12,45,15"
// Month is 0 indexed (Jan == 0)
app.post('/add-content', (req, res) => {

    // capture arguments
    const { publish_time, content_data, topic_id, email } = req.body

    // check if admin exists in db
    db.get(`SELECT admin_id FROM ADMIN WHERE email = (?)`, [email], (err, data) => {
        if (err) {
            res.status(500).send("UNEXPECTED ERROR, TRY AGAIN PLEASE")
        }
        else {
            if (data === undefined) {
                res.status(401).send("UNAUTHORIZED ACCESS, REGISTER FIRST!")
            }
            else {

                // insert content into db
                db.run(`INSERT INTO CONTENT (publish_time, content_data, topic_id) VALUES (?,?,?)`, [publish_time, content_data, topic_id], (err) => {
                    if (err) {
                        res.status(500).send("ERROR WHILE INSERTING, PLEASE TRY AGAIN!")
                    }
                    else {
                        res.status(200).json({
                            content: content_data,
                            publish_time: publish_time,
                            Admin_email: email,
                            result: "SUCCESSFULL INSERTION"
                        })
                    }
                })
            }
        }
    })
});

// Client's endpoint -> takes sub_email, topic
app.post('/:newsletter/subscribe', (req, res) => {

    // capture url arguments
    const { newsletter } = req.params

    // capture arguments
    const { sub_email, topic } = req.body

    db.get(`SELECT admin_id FROM ADMIN WHERE title = (?)`, [newsletter], (err, admin) => {
        if (err) res.status(500).send("ERROR PLEASE TRY AGAIN!");
        else {
            if (admin !== undefined) {

                // insert the subscriber email and their chosen topic into the db
                db.run(`INSERT INTO SUBSCRIBER (sub_email, topic, admin_id) VALUES (?,?,?)`, [sub_email, topic, admin.admin_id], (err) => {
                    if (err) {
                        res.status(500).send("ERROR WHILE INSERTING, PLEASE TRY AGAIN!")
                    }
                    else {

                        // select the scheduled time, data for the chosen topic by subscriber from db
                        // create and schedule a mail to be sent at specified time
                        db.all(`select distinct publish_time, content_data from content WHERE topic_id IN (SELECT topic_id from topics where name == (?))`,
                            [topic], (err, rows) => {
                                if (err) {
                                    res.status(500).send("ERROR PLEASE TRY AGAIN!")
                                }
                                else {
                                    rows.forEach(async (row) => {

                                        // capture the row from db 
                                        const { publish_time, content_data } = row
                                        const [year, month, day, hour, min, sec] = publish_time.split(",")

                                        // capture date-time to be used by scheduler
                                        const date = new Date(year, month, day, hour, min, sec)

                                        // mailOptions are created, email is sent by userid specified env file
                                        const mailOptions = {
                                            from: process.env.USER_ID,
                                            to: sub_email,
                                            subject: `NEWSLETTER - TOPIC: ${topic}`,
                                            text: content_data
                                        };

                                        // node-schedule package is used to schedule jobs at specified date-time
                                        const SCHEDULE = schedule.scheduleJob(date, () => {

                                            // nodemailer is used to sendMail to specified user/subscriber
                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    console.log(error);
                                                }
                                                else {
                                                    console.log(info);
                                                }
                                            });
                                        })
                                    })
                                }
                            })
                        res.status(200).send(`NEWLETTER SCHEDULED FOR USER: ${sub_email} AND TOPIC: ${topic}`)
                    }
                })
            }
        }
    })
})





// Server Config
app.listen(process.env.PORT, () => {
    console.log(`App live at http://localhost:${process.env.PORT}`)
})  