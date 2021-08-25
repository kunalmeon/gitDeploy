const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const appError = require("./utils/appError");
const globalErrorHandler = require("./controller/globalErrorController/globalErrorHandler");
  
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dataSanitizer = require("express-mongo-sanitize");
const xssCleaner = require("xss-clean");


//Deployment
const compression=require('compression')
/*to compress text files like html,json,text and other before sending them 
to user. */
app.use(compression())


app.use(helmet());


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: ["'self'", "unsafe-inline"],

      scriptSrc: ["'self'", "https://*.cloudflare.com"],

      scriptSrcElem: ["'self'", "https:", "https://*.cloudflare.com"],

      styleSrc: ["'self'", "https:", "unsafe-inline"],

      connectSrc: ["'self'", "data", "https://*.cloudflare.com"],
    },
  })
);
app.use(express.json({ limit: "10kb" })); // limit data coming from body to prevent from attackers heavy code

app.use(dataSanitizer());
app.use(xssCleaner());

app.use(morgan("tiny"));

const limitMiddleware = rateLimit({
  max: 3,
  windowMs: 15 * 1000,
  message: "request limit reached. Please try after one hour",
});

const viewRouter = require("./routes/viewRoute");
const tourRoutes = require("./routes/tourRoute");
const userRoutes = require("./routes/userRoute");
/*Let us make API for booking routes */
const bookingRoute=require('./routes/bookingRoutes')

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.status(200).render("base", { pugVariable1: "Karan" });
});

app.get("/", (req, res, next) => {
  res.status(200).render("base", {
    title: "Home Page",
    name: "kunal",
  });
});
app.get("/overview", (req, res, next) => {
  res.status(200).render("overview", { title: "All Tours" });
});
app.get("/tour", (req, res, next) => {
  res.status(200).render("tour", { title: "The Forest Hiker" });
});

app.use(cookieParser());
app.use("/", viewRouter);

app.use("/api/tour", limitMiddleware);
app.use("/api/user", userRoutes);
app.use("/api/tour", tourRoutes);
app.use('/api/bookings',bookingRoute)

app.all("*", (req, res, next) => {
  next(new appError("invalid url", 400));
});

app.use(globalErrorHandler);

module.exports = app;
