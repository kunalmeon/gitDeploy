const express=require('express')
const viewController=require('../controller/viewController')
const router=express.Router();

const authcontroller=require('../controller/authController');




const bookingController=require('../controller/bookingController')
//before booked tour
// router.get('/',authcontroller.isLoggedIn,viewController.overview)

//after booked tour.
router.get('/',bookingController.getCheckoutSession, authcontroller.isLoggedIn,viewController.overview)
router.get('/tour/:slug',authcontroller.isLoggedIn,viewController.getTour);
router.get('/login',authcontroller.isLoggedIn,viewController.logIn);

//6 Let us view rendered tours. 
router.get('/my-tours',viewController.getMyTours)
router.get('/me',authcontroller.protect ,viewController.getAccount)

module.exports=router