import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";


export default function useSocketEvent(eventName,handler){
    const {socket} = useSocketContext()
    useEffect(()=>{
        if (!socket) return
        socket.on(eventName,handler)
        return ()=>{
            socket.off(eventName,handler)
        }
    },[socket,eventName,handler])
}