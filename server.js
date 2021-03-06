const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const massive = require('massive');
const bcrypt = require('bcrypt');
const controller = require('./ctrl');
const path = require('path');
require('dotenv').config();
const app = express();


massive(process.env.DATABASE_URL)
    .then(db => {
        app.set('db', db);
    });
    
    app.use(session({
        secret: 'keyboard cat',
        expires: 864000000,
        maxAge: 864000000,
        resave: true,
        saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: '*'}));


app.post('/signup', controller.createSignup);
app.post('/login', controller.createLogin);
app.get('/signout', controller.sessionDestroy);
app.get('/user', controller.readEmployee);
app.get('/hours', controller.getHours);
app.get('/total-hours', controller.totalHours);
app.get('/time-status', controller.timeStatus);
app.get('/api/employees', controller.getEmployeeInfo);
app.post('/clock-in', controller.clockIn);
app.put('/clock-out', controller.clockOut);


//this is a catch all so that your front end always shows up when hosted
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})


//this is the listen for the port which heroku is giving your your server through the process.env.PORT 
app.listen(process.env.PORT || 8080, () => console.log('ready!!'));