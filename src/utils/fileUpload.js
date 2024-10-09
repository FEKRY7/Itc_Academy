const multer = require('multer');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const http = require("../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("./httperespons.js");

// Middleware for handling multer errors
const HME = (err, req, res, next) => {
    if (err) {
        console.log(err);
        return First(res, ["Multer error", err], 400, http.FAIL);
    } else {
        next();
    }
};

// Paths for various uploads
const pathName = {
    userProfile: 'user/profilpic',
    userProfileCover: 'user/profile/cover',
    createproduct: 'products',
    createtracke: 'trackes',
    CreateCategory: 'Category',
    Course: 'Course',
    Instructor: 'Instructor',
    lectureFiles: 'lectureFiles',
    serviceFiles: 'serviceFiles',
};

// Function to configure multer
function myMulter(pathName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, `uploads/${pathName}`);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            cb(null, nanoid() + "_" + file.originalname);
        }
    });
    
    const fileFilter = function (req, file, cb) {
        // Customize the file filter logic here
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jif', 'video/mp4', 'video/quicktime', 'audio/mpeg', 'application/pdf'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Invalid file type. Allowed types: ' + allowedMimeTypes.join(', ')), false); // Reject the file
        }
    };

    return multer({ storage, fileFilter });
}

// Function to delete old images
const deleteOldImage = async (imageUrl) => {
    try {
        if (fs.existsSync(imageUrl)) {
            await fs.promises.unlink(imageUrl);
            console.log('Old Image Deleted Successfully');
        } else {
            console.log('Old Image File Not Found');
        }
    } catch (err) {
        console.error('Error deleting old image:', err);
    }
};

module.exports = {
    HME,
    myMulter,
    pathName,
    deleteOldImage
}


    
