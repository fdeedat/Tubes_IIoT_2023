if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

const express = require('express');
const mqtt = require('mqtt');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bcrypt = require("bcrypt")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

// Server's parameters
const host = 'localhost';
const hostMqtt = 'iot.tf.itb.ac.id';
const port = 3000;

// database thingy
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loginData.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});

const passport = require('passport')
const initPassport = require("./data/passport-config.js")

// middleware & static files
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

let userTemp = [];

let sql = `SELECT * FROM users`;
db.all(sql, [], (err,rows)=>{
    if(err) return console.error(err.message);
    userTemp = [];
    userTemp = rows;
});

initPassport(
    passport,
    NIM => userTemp.find(user => user.NIM === NIM),
    userTemp
);

// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Controllers
const {homeAdmin,adminCreate,adminDelete} = require('./controller/admin');
const {logout,postRegister,checkAuthenticated,checkNotAuthenticated} = require('./controller/logger');

// mqtt things 
const client = mqtt.connect(`mqtt://${hostMqtt}:1883`);
const topic = 'deedat/iotkewren';

// admin stuffs
app.get('/admin',homeAdmin);
app.get('/admin/delete',adminCreate);
app.get('/admin/create',adminDelete);

//route thingyszzszz
app.get('/',checkNotAuthenticated,(req, res) => res.render("login"));
app.get('/praktikum',checkAuthenticated,(req, res) => res.render("praktikum"));
app.get('/register',checkNotAuthenticated,(req, res) => res.render("register"));

// post thingyisszzzz
app.post('/register',checkNotAuthenticated, postRegister);
app.delete('/logout',logout);
app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/praktikum',
    failureRedirect: '/',
    failureFlash: true
    }
));

server.listen(port, () => {
    console.log(`App is running on ${host}:${port}`);
    let sql = `SELECT * FROM users`;
    db.all(sql, [], (err,rows)=>{
        if(err) return console.error(err.message);
        userTemp = [];
        userTemp = rows;
    });
});

// Getting the info from frontend via websocket
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('buttonState', (stream) => {
        console.log(stream,socket.id);
        client.publish(topic,`${stream.state}`);
    });
});
