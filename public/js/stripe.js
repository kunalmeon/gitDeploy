import { Stripe } from "stripe";
import axios from 'axios'

const stripe = Stripe(
  "sk_test_51JRavdJHIGuWRJo9rAuOoUP7GCaBoACkkgYMED6P3cdTQw1JSpi8T6msYni7fuYNZkAFUztwpC1yoWZWpruwBrHX00PBKVh54r"
);

//
exports.bookTour=async tourId=>{
  try {
        // a) get chekot session from API
    const session=await axios(`/api/bookings/checkout-session/${tourId}`)
    //now we have to intergrate stripe file into index.js with booking button
    // go to index.js file
    
    // b) create chekout from + charge credit card
    await stripe.redirectToCheckout({
        sessionId:session
    })
  } catch (error) {
      console.log(error.message)
  }

}

/*Summarry:
First we made API. Then we make a button in front end. To this button we will add eventlistener
which will call the API along with tour id that we need to pass in backend. So once the session is
successful we will redirect to the page. This redirect url was defined inside the API
*/


/*The next part is we are going to save the bookings into the database.
For that we will cretae model for booking and if the checkout is successful
then only we will save the bookings into the database. Once the bookings are saved
then we can render them making a page. So let us implement that.  */