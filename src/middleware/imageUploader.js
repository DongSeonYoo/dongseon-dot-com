const AWS = require("../../config/s3");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const path = require("path");

const { maxPostImageCount } = require("../module/global");
const { BadRequestException } = require("../module/customError");
const env = require('../config/env');

const s3 = new AWS.S3();
const allowedExtensions = ['.png', '.jpg', '.jpeg'];

const postImageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "postImage",
                key: (req, file, callback) => {
                    const extension = path.extname(file.originalname);
                    if (!allowedExtensions.includes(extension)) {
                        return callback(new Error("wrong extension"));
                    }
                    callback(null, `${req.decoded.loginId}/post/${Date.now()}_${file.originalname}`);
                },
                transform: function (req, file, callback) {
                    callback(null, sharp().resize({ width: 800 }));
                },
            },
        ],
        acl: "public-read-write"
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: maxPostImageCount,
    }
});

const profileImageUploder = multer({
    storage: multerS3({
        s3: s3,
        bucket: env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        id: "profileImage",
        key: (req, file, callback) => {
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            console.log(`profileImageUpload excute!`);
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
                if (err instanceof multer.MulterError) {
                    return next(new BadRequestException("이미지 개수를 확인해 주세요"));
                }
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


//LIMIT_UNEXPECTED_FILE
