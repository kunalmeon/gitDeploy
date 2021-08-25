const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");
const multer = require("multer");
const sharp = require("sharp");

const appError = require("../utils/appError");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const userList = await userModel.find();
  res.send(userList);
});
exports.createNewUser = catchAsync(async (req, res, next) => {});
exports.getSingleUser = (req, res, next) => {
  res.status(500).json({
    status: "failed",
  });
};

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("invalid image ", 400), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

exports.uploadUserImage = upload.single("photo");

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })

    .toFile(`./public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file); //to see how multer's file information looks like
  console.log(req.body);
  let filteredObject = {};
  const bodyObject = req.body;
  const allowedFiledsToUpdate = ["name", "email"];
  Object.keys(bodyObject).forEach((el) => {
    if (allowedFiledsToUpdate.includes(el)) {
      filteredObject[el] = bodyObject[el];
    }
  });
  if (req.file) {
    filteredObject.photo = req.file.filename; //From schema it will select value of default option.
  }

  const updateUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updateUser,
  });
});

exports.deleteUser = (req, res, next) => {
  res.status(500).json({
    status: "failed",
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleteUser = await userModel.findByIdAndUpdate(req.user.id, {
    active: false,
    new: true,
  });
  res.status(204).json({
    status: "deactivated",
  });
});
