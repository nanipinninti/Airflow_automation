import { createContext,useContext,useEffect,useState } from "react";
import { getSocket } from "../services/socket";

const SocketContext = createContext(null)

export const SocketProvider = ({children}) =>{
    const [socket,setSocket] = useState(null)
    const [isConnected,setIsConnected] = useState(false)

    useEffect(()=>{
        const s = getSocket()

        s.connect()

        s.on("connect",()=>setIsConnected(true))
        s.on("disconnect",()=>setIsConnected(false))

        setSocket(s)
        
        return ()=>{
            s.off("connect")
            s.off("disconnect")
            s.disconnect()
        }
    },[])
    
    return (
        <SocketContext.Provider value={{socket,isConnected}}>
            {children}
        </SocketContext.Provider>
    )
}


export const useSocketContext = ()=> useContext(SocketContext)