import { AnyAction } from "redux";
import { incommingMessage, datachannelOpened } from './actions';

const webrtcMiddleware = (function () {
    const RTCPeerConnection = window.RTCPeerConnection;
    let socketId: any;
    const configuration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };
    // const connection = { 'optional': [{ 'DtlsSrtpKeyAgreement': true }, { 'RtpDataChannels': true }] };
    const peerconn = new RTCPeerConnection(configuration);
    // const sdpConstraints = { 'mandatory': { 'OfferToReceiveAudio': false, 'OfferToReceiveVideo': false } };
    let dataChannel: RTCDataChannel

    peerconn.onnegotiationneeded = function (event) {
        console.log('onnegotiationneeded');
    };
    peerconn.oniceconnectionstatechange = function (event) {
        console.log('oniceconnectionstatechange');
    };
    peerconn.onsignalingstatechange = function () {
        console.log('onsignalingstatechange');
    };

    function logError(error: any) {
        console.log("logError", error);
    }
    function createOffer(store: any, socketId: any, action: AnyAction) {
        dataChannel = peerconn.createDataChannel("text_chan");
        peerconn.createOffer((desc) => {
            console.log('createOffer', desc);
            peerconn.setLocalDescription(desc, () => {
                store.dispatch({ type: "EXCHANGE", payload: { 'to': action.payload, 'sdp': peerconn.localDescription } })
            }, logError);
        }, logError);

        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
            store.dispatch(datachannelOpened());
            dataChannel.send("hello message");
        };
        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };
        dataChannel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
            store.dispatch(incommingMessage(socketId, event.data));
        };
        dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };
    }
    function exchange(store: any, data: any) {
        if (socketId === null) {
            socketId = data.from;
        }
        if (data.sdp) {
            console.log('exchange sdp', data);
            peerconn.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
                if (peerconn.remoteDescription)
                    peerconn.createAnswer((desc) => {
                        console.log('createAnswer', desc);
                        peerconn.setLocalDescription(desc, () => {
                            console.log('setLocalDescription', peerconn.localDescription);
                            store.dispatch({ type: "EXCHANGE", payload: { 'to': data.from, 'sdp': peerconn.localDescription } });
                        }, logError);
                    }, logError);
            }, logError);
        } else {
            console.log('exchange candidate');
            try {
                peerconn.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error(error);
            }
        }
    }
    return (store: any) => (next: any) => (action: any) => {
        peerconn.onicecandidate = function (event) {
            console.log('onicecandidate');
            if (event.candidate && socketId !== null) {
                store.dispatch({ type: "EXCHANGE", payload: { 'to': socketId, 'candidate': event.candidate } })
            }
        };
        peerconn.ondatachannel = function (event) {
            console.log('ondatachannel');
            const receiveChannel = event.channel;
            receiveChannel.onmessage = function (event) {
                store.dispatch(incommingMessage(socketId, event.data));
            };
        }

        switch (action.type) {
            case "CREATE_OFFER":
                socketId = action.payload;
                createOffer(store, socketId, action);
                break;
            case "WEBTRC_EXCHANGE":
                exchange(store, action.payload);
                break;
            case "SEND_MESSAGE":
                dataChannel.send(action.payload);
                break;
            default:
                return next(action);
        }
    }
})();

export default webrtcMiddleware;