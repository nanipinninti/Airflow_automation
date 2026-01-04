import Header from "../components/header"
import Custom from "../components/custom"
import Table from "../components/table"
import Upload from "../components/upload"

function Home() {
  return (
    <div className='w-full h-full p-5 flex flex-col gap-6'>
        {/* Header */}
        <div className="w-full">
            <Header />
        </div>

        <div className="md:flex-row flex flex-col gap-5 w-full">
            <div className="w-full md:w-1/3 flex flex-col gap-5">
                <Upload />
                <Custom />
            </div>
            <div className="w-full md:w-2/3">
                <Table />
            </div>
        </div>
    </div>
  )
}

export default Home
