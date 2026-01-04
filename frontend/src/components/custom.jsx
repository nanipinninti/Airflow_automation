import { useState } from "react"
export default function Custom(){
    const [studentName,setStudentName] = useState("")
    const [studentAge,setStudentAge] = useState(null)
    const [studentClass, setStudentClass] = useState(null)  // class

    return (
        <div className="w-full bg-[#FDFDFB] flex flex-col gap-3  p-6 rounded-xl shadow">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                    {/* Icon */}
                    <div className="text-[#C36522]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus-icon lucide-user-round-plus"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>
                    </div>
                    <h1 className="text-[18px] text-[#372C25] font-semibold">Manual Entry</h1>
                </div>
                <h1 className="text-[#847062] text-sm">Add a student record manually</h1>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-2">
                {/* Name Field */}
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1 items-center">
                        {/* icon */}
                        <div className="text-[#847062]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <h1 className="text-sm">Name</h1>
                    </div>
                    <input
                        placeholder="Enter student name"
                        className="bg-[#F8F5F2] w-full rounded-lg p-2 px-2 text-[14px]
                        border border-gray-200 
                        hover:border-[#C36522]
                        focus:outline-none
                        focus:border-[#A54E1C]
                        focus:ring-1
                        focus:ring-[#A54E1C]"
                        value={studentName}
                        onChange={e=>(setStudentName(e.target.value))}
                    />
                </div>

                <div className="flex justify-between gap-5">
                    {/* Age Field */}
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                            {/* icon */}
                            <div className="text-[#847062]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>                            </div>
                            <h1 className="text-sm">Age</h1>
                        </div>
                        <input
                            placeholder="Age"
                            className="bg-[#F8F5F2] w-full rounded-lg p-2 px-2 text-[14px]
                                border border-gray-200 
                                hover:border-[#C36522]
                                focus:outline-none
                                focus:border-[#A54E1C]
                                focus:ring-1
                                focus:ring-[#A54E1C]"
                            value={studentAge}
                            onChange={e=>(setStudentAge(e.target.value))}
                            type="number"
                        />
                    </div>

                    {/* Class Field */}
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1 items-center">
                            {/* icon */}
                            <div className="text-[#847062]">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
            
                            </div>
                            <h1 className="text-sm">Class</h1>
                        </div>
                        <input
                            placeholder="Class"
                            className="bg-[#F8F5F2] w-full rounded-lg p-2 px-2 text-[14px]
                                border border-gray-200 
                                hover:border-[#C36522]
                                focus:outline-none
                                focus:border-[#A54E1C]
                                focus:ring-1
                                focus:ring-[#A54E1C]"  
                            value={studentClass}
                            onChange={e=>(setStudentClass(e.target.value))}
                        />
                    </div>

                </div>
            </div>

            {/* Add Button */}
            <div className="flex items-center justify-center text-white bg-[#C36522] p-2 text-[12px] gap-2 rounded-lg"
                    onClick={()=>(alert(studentName))}>
                {/* icon */}
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus-icon lucide-user-round-plus"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>
                </div>
                <h1>Add Student</h1>
            </div>
        </div>
    )
}
