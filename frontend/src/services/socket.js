import {io} from 'socket.io-client'

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export const getSocket = ()=>{
    if (!socket){
        socket = io(URL,{
            autoConnect : false,
            reconnection : true,
            reconnectionAttempts : 10,
            reconnectionDelay : 1000,
            transports : ["websocket"]
        })
    }
    return socket
}