const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { AppError } = require('../helpers/errors');

const TMP_DIR = path.resolve('./tmp');

class ImageService {
  static upload(name) {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, TMP_DIR);
      },
      filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${uuid()}.${ext}`);
      },
      limits: { fileSize: 1048576 },
    });

    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new AppError(400, 'The file must be an image!'), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, ...pathSegments) {
    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

    await fse.ensureDir(fullFilePath);

    (await Jimp.read(file.path))
      .cover(250, 250)
      .quality(60)
      .write(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
