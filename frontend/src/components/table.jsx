import { useEffect, useState } from "react"
import axios from "axios"
import {useSocketContext} from "../context/SocketContext"
import useSocketEvent from "../hooks/useSocketEvent"

export default function Table(){
    const [studentRecords, setStudentRecords] = useState([]);
    const {isConnected} = useSocketContext()

    useEffect(() => {
        if (isConnected) {
            console.log("Connected to the socket server")
        }else{
            console.log("Disconnected to the socket server")
        }
    }, [isConnected]);

    useSocketEvent("fetchStudentRecords",()=>{
        fetchStudentRecords()
    })

    const fetchStudentRecords = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/all`);

            // Axios stores result in response.data
            setStudentRecords(response.data.map(student=>({
                studentId : student.id,
                studentName : student.name,
                studentAge : student.age,
                studentClass : student.studentClass
            })));

        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };  


    useEffect(()=>{
        fetchStudentRecords()  
    },[])

    return (
        <div className="w-full bg-[#FDFDFB] flex flex-col gap-3  p-6 rounded-xl shadow min-h-[400px]">
            {/* Header */}
            <div className="flex justify-between">
                <div className="flex gap-2">
                    {/* Icon */}
                    <div className="text-[#C36522]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>                    </div>
                    <h1 className="text-[18px] text-[#372C25] font-semibold">Student Records</h1>
                </div>
                <h1 className="text-[#847062] text-sm bg-[#EBE6E0] rounded-xl px-4 flex items-center">{studentRecords.length} students</h1>
            </div>

            {/* Table */}
            <div className="w-full rounded-md overflow-hidden">
                <table className="w-full text-[14px] rounded text-center border border-gray-200">
                    <tr className="text-white bg-[#96582C] [&>th]:p-2">
                        <th>
                            ID
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Age
                        </th>
                        <th>
                            Class
                        </th>
                    </tr>
                   {
                    studentRecords.map((stud,idx)=>(
                            <tr className={`text-black [&>td]:p-2  ${(idx%2==0)?"bg-[#F3F1ED]" : "bg-[#FDFDFB] hover:bg-[#F3F1ED]"}`} id={stud.studentId}>
                        <td>
                            {stud.studentId}
                        </td>
                        <td>
                            {stud.studentName}
                        </td>
                        <td>
                            {stud.studentAge}
                        </td>
                        <td>
                            {stud.studentClass}
                        </td>
                    </tr>
                    ))
                   }
                    
                    
                    
                </table>
            </div>
        </div>
    )
}
