const express = require('express');
const bookingController =require('../controller/bookingController')
const authController =require('../controller/authController')

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);


/*8 cont..) Lt us make crud operation for the booked tours */ 

//only the admin and lead guide can see the booked tours

router.use(authController.restrictTo('admin', 'lead-guide'));
/*There is problem with factor method inside the bookingController so i have commneted below code. */
// router
//   .route('/')
//   .get(bookingController.getAllBookings)
//   .post(bookingController.createBooking);

// router
//   .route('/:id')
//   .get(bookingController.getBooking)
//   .patch(bookingController.updateBooking)
//   .delete(bookingController.deleteBooking);

module.exports = router;
