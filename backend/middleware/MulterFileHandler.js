const multer = require("multer");
const path = require("path");

const BasicHandler = (dirName, req) => {
    // 기본형
    const ext = path.extname(req.file.originalname);
    const upload = multer({
        dest: `./data/${dirName}/${req.headers.account}/`
    });
    return upload;
}

const SingleFileHandler = (dirName) => {
    return multer({
        storage: multer.diskStorage({
            destination(req, file, res) {
                res(null, `./data/${dirName}/`)
            },
            filename(req, file, res) {
                const ext = path.extname(file.originalname);
                res(null, `${req.headers.account}_${file.fieldname}_${Date.now()}${ext}`);
            }
        }),
        // limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
    });
}

const MultiFileHandler = (dirName) => {
    return multer({
        storage: multer.diskStorage({
            destination(req, file, res) {
                res(null, `./data/${dirName}/`)
            },
            filename(req, file, res) {
                const ext = path.extname(file.originalname);
                res(null, `${req.headers.account}_${file.fieldname}_${Date.now()}${ext}`);
            }
        }),
        // limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
    });
}

module.exports = { 
    BasicHandler, 
    SingleFileHandler, MultiFileHandler
}