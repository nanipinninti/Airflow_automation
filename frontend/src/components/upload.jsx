import { useState } from "react"
import axios from 'axios'

export default function Upload(){
    const [file,setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Drag functions
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile) return;

        // CSV validation
        if (
            droppedFile.type !== "text/csv" &&
            !droppedFile.name.endsWith(".csv")
        ) {
            alert("Only CSV files are allowed");
            return;
        }

        setFile(droppedFile);
    };

    const FileUpload = (e)=>{
        setFile(e.target.files[0]);
    }
    const handleFileUpload = async ()=>{
        if (!file){
            return
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/csv/upload`,
                {
                    file
                },
                {
                    headers : {
                        'Content-Type' : 'multipart/form-data'
                    }
                }
            )
            if (response.status == 200){
                alert("Sucess")
                console.log("Sucesfully uploaded")
            }else{
                alert("Internal server Error")
            }  

        }catch (error) {
            alert("Failed to upload ")
            console.log(error)
        }
    }
    return (
        <div className="w-full bg-[#FDFDFB] flex flex-col gap-3  p-6 rounded-xl shadow">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                    {/* Icon */}
                    <div className="text-[#C36522]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    </div>
                    <h1 className="text-black font-bold  text-lg "> Upload CSV</h1>
                </div>            
                <h1 className="text-[#847062] text-sm">Upload a CSV file with columns: name, age, class</h1>
            </div>

            {/* Table */}
            <div className="bg-[#FAF5F0] px-3 pb-3 border-dashed border-1 border-[#C36522] rounded-lg">
                {/* sub header */}
                <div className="text-[#C36522] text-xs flex justify-between py-3">
                    <h1 className="uppercase">
                        Expected Format
                    </h1>
                    <a
                        href="/sample.csv">
                        <div className="flex gap-1">
                            {/* Icon */}
                            <div >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                            </div>
                            <h1>Download Sample</h1>
                        </div>
                    </a>
                </div>

                {/* Table */}
                <div className="rounded-md overflow-hidden">
                    <table className="bg-[#FDFDFB] capitalize w-full rounded-lg text-center border border-gray-300 border-collapse  text-[#847062] text-[12px]">
                        <tr className="bg-[#F3F1ED] text-black border-y border-gray-300 ">
                            <th>
                                name
                            </th>
                            <th>
                                age
                            </th>
                            <th>
                                class
                            </th>
                        </tr>
                        <tr className="border-y border-gray-300">
                            <td>
                                Nani
                            </td>
                            <td>
                                21
                            </td>
                            <td>
                                16
                            </td>
                        </tr>
                        <tr className="border-y border-gray-300 ">
                            <td>
                                Rama Rao
                            </td>
                            <td>
                                26
                            </td>
                            <td>
                                15
                            </td>
                        </tr>
                    </table>
                </div>
            
            </div>

            {/* Upload */}
            <input
                id="fileUpload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={FileUpload}
            />
            <label className={`p-6 flex flex-col justify-center items-center gap-1 border-1 border-dashed border-gray-300 rounded-lg
                                hover:bg-[#F3F1ED] hover:border-[#C36522] cursor-pointer
                                 ${dragActive ? "border-[#C36522] bg-[#F3F1ED]" : "border-gray-300"}`}
                                htmlFor="fileUpload"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}>
                {/* icon */}
                <div className="text-[#847062]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload-icon lucide-upload"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
                </div>
                <h1 className="text-sm text-[#372C25]">
                    Drop your CSV here
                </h1>
                <h1 className="text-xs text-[#847062]">or click to browse</h1>
            </label>

            {/* upload Button */}
            <div className={`flex items-center justify-center text-white bg-[#C36522] p-2 text-[12px] gap-2 rounded-lg ${(!file?"opacity-50 cursor-not-allowed" : "cursor-pointer")}`}
                onClick={handleFileUpload}>
                {/* icon */}
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload-icon lucide-upload"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
                </div>
                <h1>Upload File</h1>
            </div>

        </div>
    )
}
