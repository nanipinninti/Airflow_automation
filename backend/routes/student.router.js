import express from "express"
import {fetchStudentRecords} from "../controllers/student.controller.js"


export const StudentRouter = express.Router()

StudentRouter.get("/all",fetchStudentRecords)