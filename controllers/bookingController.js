const Tours = require("../models/toursModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tours.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: "http://localhost:3000/tours/",
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    currency: "usd",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1NsQqXBcE3L24yTjqKtldDhu",
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    session,
  });
};
