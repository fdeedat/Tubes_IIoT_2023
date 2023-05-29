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
const bodyParser = require('body-parser')
const webrtc = require("wrtc")

// Server's parameters
const host = 'localhost';
const hostMqtt = 'iot.tf.itb.ac.id';
const port = 3000;
let senderStream;

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Controllers
const {homeAdmin} = require('./controller/admin');
const {logout,postRegister,checkAuthenticated,checkNotAuthenticated} = require('./controller/logger');

let tempData = {};
initPassport.initialize(passport);

// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mqtt things 
const client = mqtt.connect(`mqtt://${hostMqtt}:1883`);
const topicButton = 'K03/buttonState';
const topicInputFreq = 'K03/frekuensi';
const topicInputBeban = 'K03/beban';

// admin stuffs
app.get('/admin',homeAdmin);

//route thingyszzszz
app.get('/videoHost',(req,res)=>{
    res.render('videoHost');
    app.post('/broadcast', async ({ body }, res) => {
        const peer = new webrtc.RTCPeerConnection({
            iceServers: [
                { 
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        peer.ontrack = (e) => handleTrackEvent(e, peer);
        const desc = new webrtc.RTCSessionDescription(body.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }
        res.json(payload);
    });
    app.post("/consumer", async ({ body }, res) => {
        const peer = new webrtc.RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        const desc = new webrtc.RTCSessionDescription(body.sdp);
        await peer.setRemoteDescription(desc);
        senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }
        res.json(payload);
    });
});

// post thingyisszzzz
app.post('/register',checkNotAuthenticated, postRegister);
app.delete('/logout',logout);
app.post('/login',checkNotAuthenticated,passport.authenticate('local',{
    successRedirect: '/praktikum',
    failureRedirect: '/',
    failureFlash: true
    })
);

app.get('/',checkNotAuthenticated,(req, res) => {
    res.render("login");
});
app.get('/praktikum',checkAuthenticated,(req, res) => {
    console.log(tempData);
    res.render("praktikum",{tempData});
});
app.get('/register',checkNotAuthenticated,(req, res) => res.render("register"));


function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};

server.listen(port, () => {
    console.log(`App is running on ${host}:${port}`);
    let query = `SELECT * FROM users`;
    db.all(query, [], (err,rows)=>{
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
        client.publish(topicButton,`${stream.state}`);
    });
    socket.on('inputSys', (stream)=>{
        console.log(stream,socket.id);
        client.publish(topicInputFreq, `${stream.solFreq}`);
        client.publish(topicInputBeban, `${stream.bebanCell}`);
    })
});