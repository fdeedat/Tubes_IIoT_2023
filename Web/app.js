const express = require('express');
const mqtt = require('mqtt');
const app = express();
const socket = require('socket.io');
const host = 'localhost';
const hostMqtt = 'iot.tf.itb.ac.id';
const port = 8000;

const client = mqtt.connect(`mqtt://${hostMqtt}:1883`);

// middleware & static files
app.use(express.static('./public'));

// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/',(req, res) => {
    res.render("home");
});

const server = app.listen(port, () => {
    console.log(`App is running`);
});

const io = socket(server);

const topic = 'deedat/iotkewren';

// Getting the info from frontend via websocket
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('buttonState', (stream) => {
        console.log(stream,socket.id);
        if (stream.state === 1){
            console.log("Publish to mqtt");
            client.publish(topic,"insert");
        }
    });
});