import multer from "multer";

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize: 500*1024 // 500KB
    }
})


export default upload;