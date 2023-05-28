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
app.use(methodOverride('_method'))


// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

let userTemp = [];

//route thingyszzszz
app.get('/',checkNotAuthenticated,(req, res) => {
    res.render("login");
});

// const User = require('./models/user');
initPassport(
    passport,
    NIM => userTemp.find(user => user.NIM === NIM),
    userTemp
);

// mqtt things 
const client = mqtt.connect(`mqtt://${hostMqtt}:1883`);
const topic = 'deedat/iotkewren';

app.get('/praktikum',checkAuthenticated,(req, res) => {
    res.render("praktikum");
});

app.get('/admin',(req, res) => {
    //displaying sql data
    let sql = `SELECT * FROM users`;
    db.all(sql, [], (err,rows)=>{
        if(err) return console.error(err.message);
        res.send(rows);
        let userTemp = [];
        console.log(userTemp);
    });
});

app.get('/register',checkNotAuthenticated,(req, res) => {
    res.render("register");
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/praktikum',
    failureRedirect: '/',
    failureFlash: true
    }
));

app.post('/register',checkNotAuthenticated, async(req,res)=>{
    const NIM = req.body.NIM;
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        // insert NIM dan password ke database 
        let insert = `
            INSERT INTO users(NIM,password)
            VALUES(?,?)
            `;
        let values = [NIM,hashedPassword]
        db.run(insert,values,(err)=>{
            if(err){
                console.error(err.message);
            }else{
                console.log(`inserted NIM, pass and time: ${NIM}, ${hashedPassword}`);
            };
        });
        res.redirect("/");
    }catch{
        res.redirect('/register');
    };
});

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
        if (stream.state === 1){
            console.log("Publish to mqtt"); // do some command
            client.publish(topic,"insert");
        }
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/praktikum')
    }
    next()
}