const socket = io();
const host = 'localhost';
socket.connect(`http://${host}:8000`);

// DOM things
const btn = document.getElementById('button');
const btnTitle = document.getElementById("buttonTitle");
const resetButton = document.getElementById("resetButton");
const sendFreq = document.getElementById("sendFreq");
const sendBeban = document.getElementById("sendBeban");

btnTitle.innerHTML = "DISCONNECTED";

// Callback function for click event
btn.addEventListener('click', sendOverSocket);
sendFreq.addEventListener('click',callbackSendFreq);
sendBeban.addEventListener('click',callbackSendBeban);
resetButton.addEventListener('click',callbackReset);

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

async function callbackSendFreq() {
    // add dom things @catur
    let freqInput = document.getElementById("freqInput").value;
    // let bebanInput = document.getElementById("bebanInput").value;
    await socket.emit('inputFreq',{
        solFreq : freqInput
    });
};

async function callbackSendBeban() {
    // add dom things @catur
    // let freqInput = document.getElementById("freqInput").value;
    let bebanInput = document.getElementById("bebanInput").value;
    await socket.emit('inputBeban',{
        bebanCell : bebanInput
    });
};

async function callbackReset() {
    // add dom things @catur
    document.getElementById("freqInput").value = '';
    document.getElementById("bebanInput").value = '';
    await socket.emit('inputBeban',{
        bebanCell : '0'
    });
    await socket.emit('inputFreq',{
        solFreq : '0'
    });
};

window.onload = () => {
    document.getElementById("button").onclick = ()=>{
        init();
    }
}

async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
};
