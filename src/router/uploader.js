const router = require("express").Router();
const imageUploader = require("../middleware/imageUploader");
const authGuard = require("../middleware/authGuard");

router.post("/file/post", authGuard, imageUploader.postImageUpload(), async (req, res, next) => {
    const images = req.files;
    const result = {
        data: [],
    }

    result.data = images.map(item => item.transforms[0].location);
    res.send(result);
});

router.post("/file/profile", authGuard, imageUploader.profileImageUpload(), async (req, res, next) => {
    const image = req.file;
    const result = {
        data: "",
    }

    result.data = image.location;
    res.send(result);
});

module.exports = router;
