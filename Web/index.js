const express = require('express');
const mqtt = require('mqtt');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

const host = 'localhost';
const hostMqtt = 'iot.tf.itb.ac.id';
const port = 3000;

// mqtt things 
const client = mqtt.connect(`mqtt://${hostMqtt}:1883`);
const topic = 'deedat/iotkewren';

// middleware & static files
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false}));

// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/',(req, res) => {
    res.render("login");
});

app.get('/praktikum',(req, res) => {
    res.render("praktikum");
});

app.post('/login',(req,res)=>{
    console.log(req.body);
    const {NIM, pass} = req.body;
    if(NIM ==='' || pass === ''){
        res.redirect('/');
    }
    else{
        res.redirect("/Gelombang_Berdiri");
    }
});

server.listen(port, () => {
    console.log(`App is running on ${host}:${port}`);
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