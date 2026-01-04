export default function Header(){
    return (
        <div className="flex flex-col gap-2 items-center p-2 text-center">
            {/* Icon */}
            <div className="w-fit text-[#FFFFFF] bg-[#C36522] rounded-xl p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
            </div>
            <h1 className="text-3xl font-bold text-[#372C25]">Student Data Upload Portal</h1>
            <h1 className="text-muted-foreground text-[#847062]">Upload CSV files or add student records manually</h1>
        </div>
    )
}