import { AnyAction } from "redux";
import { incommingMessage, datachannelOpened } from './actions';

const webrtcMiddleware = (() => {
    const RTCPeerConnection = window.RTCPeerConnection;
    let socketId: string;
    const configuration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };
    // const connection = { 'optional': [{ 'DtlsSrtpKeyAgreement': true }, { 'RtpDataChannels': true }] };
    const peerconn = new RTCPeerConnection(configuration);
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
        console.log("logError", error.message);
    }
    var count = 0;
    function createOffer(store: any, socketId: string, action: AnyAction) {
        dataChannel = peerconn.createDataChannel("text_chan");
        if (count === 0) {
            count++
        } else {
            return
        }
        /** Create local offer */
        peerconn.createOffer({ voiceActivityDetection: false })
            .then(offer => {
                console.log('createOffer', offer);
                peerconn.setLocalDescription(new RTCSessionDescription(offer));
            })
            .then(() => {
                console.log("peerconn.localDescription", peerconn.localDescription)
                store.dispatch({ type: "EXCHANGE", payload: { 'to': action.payload, 'sdp': peerconn.localDescription } })
            })
            .catch(logError)

        dataChannel.onopen = function (event) {
            console.log('%c dataChannel.onopen', 'background: #222; color: #bada55');
            // store.dispatch(datachannelOpened());
            // dataChannel.send("hello message");
        };
        dataChannel.onclose = () => {
            console.log('%c dataChannel.onclose', 'background: #222; color: #bada55');
        };

        dataChannel.onmessage = (event) => {
            console.log("dataChannel.onmessage:", event.data);
            store.dispatch(incommingMessage(socketId, event.data));
        };
        dataChannel.onerror = (error) => {
            console.log("dataChannel.onerror", error);
        };
    }

    function exchange(store: any, data: any) {
        if (!socketId || socketId === null) {
            socketId = data.from;
        }

        if (data.sdp) {
            console.log('exchange sdp', data);
            peerconn.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
                if (peerconn.remoteDescription)
                    peerconn.createAnswer((desc) => {
                        peerconn.setLocalDescription(desc, () => {
                            store.dispatch({ type: "EXCHANGE", payload: { 'to': data.from, 'sdp': peerconn.localDescription } });
                        }, logError);
                    }, logError);
            }, logError);
        } else {
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
            if (event.candidate && socketId && socketId !== null) {
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
                //store.dispatch(incommingMessage(socketId, action.payload));
                //peerconn.textDataChannel.send(action.payload);
                break;
            default:
                return next(action);
        }
    }
})();

export default webrtcMiddleware;