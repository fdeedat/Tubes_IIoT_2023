const socket = io();
const host = 'localhost';
socket.connect(`http://${host}:8000`);

// DOM things
const btn = document.getElementById('button');
const btnTitle = document.getElementById("buttonTitle");
btnTitle.innerHTML = "DISCONNECTED";

// Callback function for click event
btn.addEventListener('click', sendOverSocket);

//init state
let currentState = 0;

async function sendOverSocket() {
    console.log('button clicked');
    if (currentState === 0){
        await socket.emit('buttonState', {
            state: 1,
        });
        currentState = 1;
        btnTitle.innerHTML = "CONNECTED";
    }else{
        await socket.emit('buttonState', {
            state: 0
        });
        currentState=0;
        btnTitle.innerHTML = "DISCONNECTED";
    }
};