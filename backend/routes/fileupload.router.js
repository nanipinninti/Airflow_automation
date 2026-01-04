import express from "express"
import {upload} from '../middleware/s3_upload.js'
import {fileUploader} from "../controllers/fileupload.controller.js"

export const fileUploadRouter = express.Router() 

fileUploadRouter.post("/upload",upload.single('file'),fileUploader)