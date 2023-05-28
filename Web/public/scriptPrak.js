const socket = io();
const host = 'localhost';
socket.connect(`http://${host}:8000`);

// DOM things
const btn = document.getElementById('button');
const btnTitle = document.getElementById("buttonTitle");
btnTitle.innerHTML = "DISCONNECTED";

// Callback function for click event
btn.addEventListener('click', sendOverSocket);

window.onload = () => {
    init();
};

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