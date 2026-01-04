import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
// Socket Related Importations
import http from "http"
import { Server } from "socket.io"

dotenv.config()
const app = express()

app.use(cors({
    origin : ["http://localhost:5173","http://localhost:5174",process.env.FRONT_END_DOMAIN],
    credentials : true
}))

const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin : ["http://localhost:5173","http://localhost:5174",process.env.FRONT_END_DOMAIN],
        methods : ["GET","POST","PUT","DELETE"],
        credentials : true
    },
    path : "/socket.io/"
})

import { setupSocket } from "./socketServer.js"
import { listenDB } from "./config/postgres.js"
setupSocket(io)
listenDB(io)

// Routes
import { StudentRouter } from "./routes/student.router.js"
app.use("/student",StudentRouter)

import { fileUploadRouter } from "./routes/fileupload.router.js"
app.use("/csv",fileUploadRouter)

app.get('/',(req,res)=>{
    return res.send('Hello World')
})

server.listen(process.env.PORT,()=>{
    console.log("Server running in 5000 Port")
})