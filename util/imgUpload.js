const path = require("path");
const fs = require("fs");
const logger = require("../config/logger");

exports.checkImgFromat = async (image) => {
  let imgExtension = path.extname(image.name);
  const allowedExtension = [".png", ".jpg", ".jpeg"];
  if (!allowedExtension.includes(imgExtension) || image.name.length > 30)
    return false;
  return true;
};

exports.uploadBookImg = async (image) => {
  let imgName = Date.now() + image.name;
  let uploadPath = `./uploads/book.imgs/${imgName}`;
  image.mv(uploadPath, (err) => {
    if (err) {
      logger.error(`From imgUpload : ${err}`);
      return false;
    }
  });
  return imgName;
};

exports.uploadUserImg = async (image) => {
  let imgName = Date.now() + image.name;
  let uploadPath = `./uploads/user.imgs/${imgName}`;
  image.mv(uploadPath, (err) => {
    if (err) {
      logger.error(`From imgUpload : ${err}`);
      return false;
    }
  });
  return imgName;
};

exports.removeOldImg = (oldImg) => {
  if (fs.existsSync(oldImg)) {
    fs.unlink(oldImg, () => {});
  }
};
