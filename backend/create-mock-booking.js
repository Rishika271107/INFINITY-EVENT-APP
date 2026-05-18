const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Booking = require("./models/Booking");

const createMockBooking = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI.trim());
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email: "rishi.jasper27@gmail.com" });
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }

    const booking = await Booking.create({
      user: user._id,
      serviceName: "THE TAJ PALACE",
      serviceType: "venue",
      area: "Marine Drive, Mumbai",
      eventDate: new Date("2026-06-15"),
      time: "18:00",
      duration: 1,
      guests: 200,
      totalAmount: 25000,
      bookingStatus: "confirmed",
      paymentStatus: "paid"
    });

    console.log("Mock booking created successfully!");
    console.log(booking);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createMockBooking();
