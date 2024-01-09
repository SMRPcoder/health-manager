const Jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');

var JWTsecret = "205d593a160bbb1940c2a159a6e1e933";
exports.CreateJwt = (payload) => {
    const token = Jwt.sign(payload, JWTsecret, { expiresIn: "24h" });
    return `Bearar ${token}`;
}

exports.VerifyToken = (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, JWTsecret, (err, decoded) => {
            if (err) {
                console.error('Token verification failed:', err.message);
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    })

}

// Set up storage for JSON files
const jsonStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/json/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Set up storage for image files
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Set up storage for csv files
const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/csv/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Define multer upload middleware for JSON files to upload medicine bulk
exports.UploadJson = multer({
    storage: jsonStorage, fileFilter: (req,file,cb) => {
        const allowedMimes = ['application/json'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Define multer upload middleware for image files
exports.UploadImage = multer({
    storage: imageStorage, fileFilter: (req,file,cb) => {
        const allowedMimes = ['image/jpeg', 'image/png'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Define multer upload middleware for CSV files for medicine bulk
exports.UploadCsv = multer({
    storage: csvStorage, fileFilter: (req,file,cb) => {
        const allowedMimes = ['text/csv'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});