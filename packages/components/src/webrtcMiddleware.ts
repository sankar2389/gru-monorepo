import { AnyAction } from "redux";
import { incommingMessage, datachannelOpened } from './actions';

const webrtcMiddleware = (() => {
    const RTCPeerConnection = window.RTCPeerConnection;
    let socketId: string;
    const configuration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };
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

    function logError(error: Error) {
        console.error(error.message);
    }

    function createOffer(store: any, action: AnyAction) {
        socketId = action.payload;
        dataChannel = peerconn.createDataChannel("text_chan");

        /** Create local offer */
        peerconn.createOffer({ voiceActivityDetection: false })
            .then(offer => {
                peerconn.setLocalDescription(new RTCSessionDescription(offer));
            })
            .then(() => {
                store.dispatch({ type: "EXCHANGE", payload: { 'to': action.payload, 'sdp': peerconn.localDescription } })
            })
            .catch(logError)

        dataChannel.onopen = function (event) {
            console.log('%c dataChannel.onopen      ', 'background: #62BD96; color: #000');
            store.dispatch(datachannelOpened());
        };
        dataChannel.onclose = () => {
            console.log('%c dataChannel.onclose     ', 'background: #62BD96; color: #000');
        };

        dataChannel.onmessage = (event) => {
            console.log('%c dataChannel.onmessage:  ', 'background: #62BD96; color: #000', event.data);
            store.dispatch(incommingMessage(socketId, event.data));
        };
        dataChannel.onerror = (error) => {
            console.log('%c dataChannel.onerror:    ', 'background: #F15839; color: #000', error);
        };
    }

    function exchange(store: any, data: any) {
        if (!socketId || socketId === null) {
            socketId = data.from;
        }

        if (data.sdp) {
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
            console.log('%c onicecandidate      ', 'background: #62BD96; color: #000');
            if (event.candidate && socketId && socketId !== null) {
                store.dispatch({ type: "EXCHANGE", payload: { 'to': socketId, 'candidate': event.candidate } })
            }
        };
        peerconn.ondatachannel = function (event) {
            const receiveChannel = event.channel;
            receiveChannel.onmessage = function (event) {
                store.dispatch(incommingMessage(socketId, event.data));
            };
        }

        switch (action.type) {
            case "CREATE_OFFER":
                createOffer(store, action);
                break;
            case "WEBTRC_EXCHANGE":
                exchange(store, action.payload);
                break;
            case "SEND_MESSAGE":
                if (dataChannel.readyState === "open") {
                    dataChannel.send(JSON.stringify(action.payload));
                } else {
                    alert("Please connect one first")
                }
                break;
            default:
                return next(action);
        }
    }
})();

export default webrtcMiddleware;