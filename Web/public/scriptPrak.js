const socket = io();
const host = 'localhost';
socket.connect(`http://${host}:8000`);

// DOM things
const btn = document.getElementById('button');
const btnTitle = document.getElementById("buttonTitle");
<<<<<<< Updated upstream
btnTitle.innerHTML = "OFF";
=======
btnTitle.innerHTML = "DISCONNECTED";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        btnTitle.innerHTML = "ON";
=======
        btnTitle.innerHTML = "CONNECTED";
>>>>>>> Stashed changes
    }else{
        await socket.emit('buttonState', {
            state: 0
        });
        currentState=0;
<<<<<<< Updated upstream
        btnTitle.innerHTML = "OFF";
=======
        btnTitle.innerHTML = "DISCONNECTED";
>>>>>>> Stashed changes
    }
};