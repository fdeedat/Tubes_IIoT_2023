const socket = io();
const host = 'localhost';
socket.connect(`http://${host}:8000`);

// DOM things
const btn = document.getElementById('button');
const btnTitle = document.getElementById("buttonTitle");
const sendButton = document.getElementById("sendButton");
const resetButton = document.getElementById("resetButton");
let freqInput = document.getElementById("freqInput"),
    bebanInput = document.getElementById("bebanInput")


btnTitle.innerHTML = "DISCONNECTED";

// Callback function for click event
btn.addEventListener('click', sendOverSocket);
sendButton.addEventListener('click',callbackSend);
// resetButton.addEventListener('click',callbackReset);
function sendBtn() {
    var freqInput = document.getElementById("freqInput").value;
    var bebanInput = document.getElementById("bebanInput").value;
    
    console.log(freqInput);
    console.log(bebanInput);
};
function resetBtn() {
    var freqInput = 0;
    var bebanInput = 0;
    
    console.log(freqInput);
    console.log(bebanInput);
};

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