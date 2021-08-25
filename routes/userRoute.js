const userRoute = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");
/* ImageProcessing 1) Once we have installed multer,we need to do couple of things one is set the settings ]
and another is
use that settings as middleware.Once we use it as middleware the cosucative middleware function have
acess to it in the req object because we are requesting to save image inside the database.

First image is saved into file system, in this case './public/image/users' and then we will request 
Those images to save in database. 

Here we are allowing login user to update their data so we will use updateMe api. 

*/

//ImageProcessing 1a) Import multer

// const multer = require("multer");


// var upload = multer({ dest:'./public/img/users' });

//ImageProcessing b) Settings to save image files in our file system before saving it to database

// const upload = multer({ dest: "/public/img/users" });

userRoute.post("/signup", authController.signup);
userRoute.post("/signin", authController.signin);

userRoute.get("/logout", authController.logout);

userRoute.post("/forgotPassword", authController.forgotPassword);
userRoute.patch("/resetPassword/:token", authController.resetPassword);

userRoute.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

//Without using multer
// userRoute.patch("/updateMe", authController.protect, userController.updateMe);

/*
ImageProcessing 1c) Let us use upload middleware. Below 'photo' is the name of field that is going to hold the image.
After holding image it('photo') will copy image in the destination we specified. Once upload middleware
puts the file it will call next middleware in the stack with some information about the file that was
saved inside the destination folder.

Let us check that information inside .updateMe middleware 

Go to userController.updateMe  and let us make this upload.single() middleware there
*/
userRoute.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserImage,
  userController.resizeUserImage,
  userController.updateMe
);

//deactive user account
userRoute.delete("/deleteMe", authController.protect, userController.deleteMe);

//protecting routes
userRoute
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createNewUser);
userRoute.route("/:id").get(userController.getSingleUser);
// .patch(userController.updateUser)
// .delete(userController.deleteUser);

module.exports = userRoute;
