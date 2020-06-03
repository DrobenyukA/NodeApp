const multer = require('multer');

const { generateId } = require('../utils');
const ROUTES = require('../constants/routes');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `public${ROUTES.IMAGES.PRODUCTS}`),
    filename: (req, { originalname }, cb) => cb(null, `${generateId('product')}-${originalname}`),
});

const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].some((allowedFileType) => allowedFileType === file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload.single('image');
