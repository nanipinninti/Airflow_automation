import Student from "../models/student.model.js";

export const fetchStudentRecords = async (req,res)=>{
    try{
        const students = await Student.findAll();
        return res.json(students)
    }catch(error){
        console.error("Error fetching students:", err);
        return res.status(500).send("Server Error");
    }
} 