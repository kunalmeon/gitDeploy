const stripe = require("stripe")(
  "sk_test_51JRavdJHIGuWRJo9rAuOoUP7GCaBoACkkgYMED6P3cdTQw1JSpi8T6msYni7fuYNZkAFUztwpC1yoWZWpruwBrHX00PBKVh54r"
);

const tourModel = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  console.log(stripe.checkout.session);
  //1 get the tour
  const bookedTour = await tourModel.findById(req.params.tourId);

  //2 Create CheckOut Session
  /*To create session from Stripe we need to install it and also we need
        secret key from the stripe account. "https://dashboard.stripe.com/test/apikeys"
        . Let us save it into the .env file.*/

  // stripe.checkout.session.create({
  //     payment_method_types:['card'],
  //     //redirect to url incase of success
  //     success_url:`${req.protocol}://${req.get('host')}/`,
  //     success_url:`${req.protocol}://${req.get('host')}/${tour.slug}`,
  //    //custom fields
  //     customer_email:req.user.email,
  //     client_reference_id:req.params.tourId,
  //     //product details
  //     line_items:[
  //         {
  //             name:`${bookedTour.name}`,
  //             description:bookedTour.summary,
  //             images:['https://pixabay.com/photos/road-forest-fall-path-trail-trees-1072821/'],
  //             amount:bookedTour.price*100,
  //             currency:'usd',
  //             quantity:1
  //         }
  //     ]

  // })

  //let us store session created at setp 2
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    //redirect to url incase of success
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      bookedTour.params.tourId
    }&user=${req.user.id}$price=${bookedTour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    //custom fields
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    //product details
    line_items: [
      {
        name: `${bookedTour.name}`,
        description: bookedTour.summary,
        images: [
          "https://pixabay.com/photos/road-forest-fall-path-trail-trees-1072821/",
        ],
        amount: bookedTour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3 Create session as response
  res.status(200).json({
    status: "success",
    session: session,
  });

  /*4 Now let us work in front end. I have made book tour button inside base.pug file. Now let us 
  implement logic inside the base.pug file. */
});

/*5) Once we have implemented checkout session by making a button that hits above getCheckoutSession
middleware. If the checkout was successful then we can save the data of booked tour inside the
database. As you can guess we need to make model for that. But the problem is that we have very
simple success url which can be trouble beacuse anyone can purchase whithout even paying.
SO we can modify success url by adding some other stuffs like query string.  */



const Booking = require("../models/bookingModel");
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  /*How this middleware can be used such that we can save the booked tour is there is else we have
  to show homepage so that user can make bookings. 
  Homepage ummm okay... 
                        WE can use it inside the hompage url by checking if there is no booked tour
                        then we can pass control to next middleware.
  */
  if (!tour && !user && !price) return next();
  //if there is tour booked then we can save them into database.

  await Booking.create({ tour, user, price });

  /*Once we have saved our booking now it is time to redirect user the homepage.
  ${req.protocol}://${req.get("host")}/?tour=${bookedTour.params.tourId}&user=${req.user.id}$price=${bookedTour.price}
   into http://localhost:4000 ie. we need to remove query part inoder to make homepage url.*/
  res.redirect(req.originalUrl.split(' ?')[0])

  /*One more thing we redirect to homepage 
  router.get('/',bookingController.getCheckoutSession, authcontroller.isLoggedIn,viewController.overview)
    .bookingController.getCheckoutSession will just return next() because there are no query string
    i.e  if (!tour && !user && !price) return next(); becomes true. So our trick of putting
   bookingController.getCheckoutSession into '/' url works*/
});


/*6 Now we can view the booked tour.For that we will go to viewRouter to make new API route and
we will make controller for that inside the viewController file.

Let us go to viewRoute 
*/


/** 8 cont..) */
// const factory=require('factory')
// exports.getAllBookings=factory.getAll(Booking)
// exports.createBooking=factory.createOne(Booking)
// exports.getBooking=factory.getOne(Booking)
// exports.updateBooking=factory.updateOne(Booking)
// exports.deleteBooking=factory.deleteOne(Booking)




