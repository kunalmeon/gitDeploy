exports.allTours = (req, res, next) => {
  res.status(200).render("base", { title: "Home Page" });
};

const tourModel = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
exports.overview = catchAsync(async (req, res, next) => {
  const tours = await tourModel.find();
  console.log("hello from overview");
  console.log(tours);
  res.status(200).render("overview", { title: "All Tours", tours: tours });
});

const appError = require("../utils/appError");

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: "review",
    fields: "revew user rating",
  });

  if (!tour) res.send(new appError("No tour with such name", 404));
  res.status(200).render("tour", { title: "The Forest Hiker", tour });
});

exports.logIn = catchAsync((req, res, next) => {
  res.status(200).render("login", {
    title: "Log in",
  });
});

exports.getAccount = (req, res, next) => {
  res.status(200).render("account.pug", {
    title: "your account",
  });
};

/*6 cont...) Now let us implement the logic of how we render the booked tour.
The idea is simple first we will find the user who has booked tour and then we will find
the tour id from the user. Once we have tour id then we will apply it(tour id) to use
find the detail information about the tour from the TOUR MODEL.
*/
const Booking = require("../models/bookingModel");
exports.getMyTours = catchAsync(async (req, res, next) => {
  
  //i) Now let us find the booked user from booking model
  const user = await Booking.find({ user: req.user.id });

  //ii) Since the user booked tour so it must have id of tours

  const tourId = user.map((el) => el.tour.id); //or el=>el.tour

  //Now let us find the detail information about the tour from tour MODEL using this id.
  /*Note tourId can be single or any numbers based on the user that which might have booked more than
on book. SO to find all the tours we us syntax like all the ids in tour i.e _id:{$in:tourId} */

  const tours = await tourModel.find({ _id: { $in: tourId } });

  //iii) Now it is time to render the tour. For that we will again use template by passing "tours"... 
  // inside it.
  res.status(200).render('bookedTour',{
    Title:"List of Booked Tour",
    tours:tours
  })
});


/*7) Now let us implement CRUD opeation for the booking inside the bookingRoute and offcourse the 
controller will inside the bookingController.  Let us go to bookingRoute.js file. */
