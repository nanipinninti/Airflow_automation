export const setupSocket = (io) =>{
    io.on("connection",(socket)=>{
        console.log(`User connected :${socket.id}`)
        socket.emit('connected',"Socket connection sucessful")
        socket.on('disconnect',()=>{
            console.log(`User disconnected ${socket.id}`)
        })
    })
}