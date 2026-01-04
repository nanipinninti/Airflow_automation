export const fileUploader = async (req,res)=>{
    if (!req.file){
        console.log("Failed to upload",req)
        return res.status(400).send("No file Uploaded")
    }
    res.send({
        message: 'File uploaded successfully',
        location: req.file.location, 
    })
}