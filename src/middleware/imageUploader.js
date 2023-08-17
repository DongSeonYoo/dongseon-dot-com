const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const path = require("path");

const { maxPostImageCount } = require("../module/global");

require("dotenv").config();

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECERET_ACCESS_KEY
});

const s3 = new AWS.S3();
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', 'png'];
const postImageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "postImage",
                key: (req, file, callback) => {
                    console.log("postImageUpload excute!");
                    const extension = path.extname(file.originalname);
                    if (!allowedExtensions.includes(extension)) {
                        return callback(new Error("wrong extension"));
                    }
                    callback(null, `${req.decoded.loginId}/post/${Date.now()}_${file.originalname}`);
                },
                transform: function (req, file, callback) {
                    callback(null, sharp().resize({ width: 600 }));
                },
            },
        ],
        acl: "public-read-write"
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    }
});

const profileImageUploder = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        id: "profileImage",
        key: (req, file, callback) => {
            console.log("profileImageUpload excute!");
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            callback(null, `${req.decoded.loginId}/profile/${Date.now()}_${file.originalname}`);
        },
        acl: "public-read-write"
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});

module.exports = {
    postImageUpload: () => {
        return async (req, res, next) => {
            postImageUploader.array("postImage", maxPostImageCount)(req, res, (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        }
    },

    profileImageUpload: () => {
        return async (req, res, next) => {
            profileImageUploder.single("profileImage")(req, res, (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        }
    }
}



// module.exports = async (req, res, next) => {
//     postImageUploader.array("postImage", maxPostImageCount)(req, res, (err) => {
//         if (err) {
//             next(err);
//             return;
//         }
//         next();
//     });
// };

//LIMIT_UNEXPECTED_FILE