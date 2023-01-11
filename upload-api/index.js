const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const { Dropzone } = require('./upload');
const path = require('path');

const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.post('/dropzone', Dropzone);
const fileFilter = function(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(file.mimeType)) { 
        const error = new Error("Wrong file type: " + file.mimeType);
        error.code = "LIMIT_FILES_TYPES";
        return cb(error, false);
    }
    cb(null, true);
}
const MAX_SIZE = 10000;
const upload = multer({
    dest: './uploads/',
    fileFilter,
    limits: {
        fileSize: MAX_SIZE
    }
})

// app.use('/static', express.static(path.join(__dirname, "static")));
// app.post('/dropzone' , upload.single('file') , async (req, res) => {
//     try {
//         await sharp(req.file.path)
//         .resize(300)
//         .background('white')
//         .embed()
//         .toFile(`./static/${req.file.originalname}`);
//         fs.unlink(req.file.path, () => {
//             res.json({ file: `/static/${req.file.originalname}` });
//         })
//     }catch(err) {
//         res.status(422).json({ err });
//     }
// })


app.use(function(err, req, res , next) {
    if (err.code === "LIMIT_FILES_TYPES") { 
        res.status(422).json({ error: "Only images are allowed" });
        return;
    }
    if (err.code === "LIMIT_FILES_SIZE") {
        res.status(422).json({ error: `Too large. Max size is ${MAX_SIZE/1000}MB` });
        return;
    }
});
app.listen(3344, () => console.log('Running on localhost:3344'));