const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");

// Initialize Razorpay Client with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create Razorpay Order from an existing Pending Booking
 * @route   POST /api/payment/create-order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required to initiate payment."
      });
    }

    // 1. Fetch the booking from database
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // 2. Validate ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You do not own this booking request."
      });
    }

    // 3. Prevent duplicate order creation for already paid bookings
    if (booking.paymentStatus === "paid" || booking.bookingStatus === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid and confirmed."
      });
    }

    // 4. Set up Razorpay order options (Amount must be in Paise)
    const amountInPaise = Math.round(booking.totalAmount * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_bk_${booking._id.toString().substring(18)}_${Date.now().toString().substring(8)}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        serviceName: booking.serviceName,
        serviceType: booking.serviceType
      }
    };

    // 5. Invoke Razorpay API
    const order = await razorpay.orders.create(options);

    // 6. Update Booking with Razorpay Order ID
    booking.razorpay_order_id = order.id;
    await booking.save();

    // 7. Log Transaction as pending in database
    await Transaction.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      currency: "INR",
      paymentMethod: "pending",
      razorpay_order_id: order.id,
      razorpayOrderId: order.id, // Backwards compatibility Copy
      status: "pending",
      receipt: order.receipt
    });

    return res.status(201).json({
      success: true,
      message: "Razorpay Order created and linked successfully.",
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      booking
    });

  } catch (error) {
    console.error("❌ CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate Razorpay payment order.",
      error: error.message
    });
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payment/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required Razorpay payment confirmation parameters."
      });
    }

    // 1. Re-calculate SHA256 Signature to verify integrity
    const signPayload = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signPayload.toString())
      .digest("hex");

    const isSignatureValid = razorpay_signature === expectedSignature;

    if (!isSignatureValid) {
      console.warn("⚠️ PAYMENT INTEGRITY FAIL: Invalid signature detected!");

      // Update local logs to failed
      await Transaction.findOneAndUpdate(
        { razorpay_order_id },
        { status: "failed" }
      );

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: "failed",
          bookingStatus: "failed"
        });
      }

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Possible tampering detected."
      });
    }

    // 2. Fetch Detailed Payment Metadata from Razorpay to log payment method
    let paymentMethod = "unknown";
    try {
      const paymentInfo = await razorpay.payments.fetch(razorpay_payment_id);
      if (paymentInfo && paymentInfo.method) {
        paymentMethod = paymentInfo.method;
      }
    } catch (apiErr) {
      console.warn("Could not query Razorpay payment details:", apiErr.message);
    }

    // 3. Signature is valid: Update Transaction record
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        razorpayPaymentId: razorpay_payment_id, // Compatibility
        razorpaySignature: razorpay_signature,  // Compatibility
        paymentMethod,
        status: "success"
      },
      { new: true }
    );

    // 4. Update the Booking status
    const targetBookingId = bookingId || (updatedTransaction ? updatedTransaction.booking : null);
    let updatedBooking = null;

    if (targetBookingId) {
      updatedBooking = await Booking.findByIdAndUpdate(
        targetBookingId,
        {
          paymentStatus: "paid",
          bookingStatus: "confirmed",
          razorpay_payment_id,
          razorpay_signature
        },
        { new: true }
      );
    }

    console.log(`✅ PAYMENT VERIFIED & COMPLETED: Order ${razorpay_order_id} - Booking ${targetBookingId}`);

    return res.status(200).json({
      success: true,
      message: "Payment successfully verified and booking has been confirmed.",
      transaction: updatedTransaction,
      booking: updatedBooking
    });

  } catch (error) {
    console.error("❌ VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing payment verification details.",
      error: error.message
    });
  }
};

/**
 * @desc    Retry Checkout Generation for an existing booking that failed
 * @route   POST /api/payment/retry
 * @access  Private
 */
exports.retryPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID required for payment retry."
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // Reset status to pending so it can be paid
    booking.paymentStatus = "pending";
    booking.bookingStatus = "pending";

    // Build a fresh Razorpay order
    const amountInPaise = Math.round(booking.totalAmount * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `retry_bk_${booking._id.toString().substring(18)}_${Date.now().toString().substring(8)}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        retry: "true"
      }
    };

    const order = await razorpay.orders.create(options);

    booking.razorpay_order_id = order.id;
    await booking.save();

    // Create a new pending transaction log
    await Transaction.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      currency: "INR",
      paymentMethod: "retry_pending",
      razorpay_order_id: order.id,
      razorpayOrderId: order.id,
      status: "pending",
      receipt: order.receipt
    });

    return res.status(200).json({
      success: true,
      message: "Retry checkout initialized successfully.",
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      booking
    });

  } catch (error) {
    console.error("❌ RETRY CHECKOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize payment retry.",
      error: error.message
    });
  }
};

/**
 * @desc    Initiate payment refund (Admin Feature)
 * @route   POST /api/payment/refund
 * @access  Private (Admin Only)
 */
exports.refundPayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required to process refund."
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Cannot refund a booking that hasn't been paid."
      });
    }

    if (!booking.razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment reference missing on booking. Cannot execute online refund."
      });
    }

    const refundAmount = amount ? Math.round(amount * 100) : Math.round(booking.totalAmount * 100);

    // Call Razorpay API to process refund
    const refund = await razorpay.payments.refund(booking.razorpay_payment_id, {
      amount: refundAmount,
      speed: "normal",
      notes: {
        bookingId: booking._id.toString(),
        reason: "Admin cancelled booking"
      }
    });

    // Update status in local database
    booking.bookingStatus = "cancelled";
    booking.paymentStatus = "refunded"; // Proper refund lifecycle status
    await booking.save();

    await Transaction.create({
      booking: booking._id,
      user: booking.user,
      amount: refund.amount / 100,
      currency: "INR",
      paymentMethod: "refund",
      razorpay_order_id: booking.razorpay_order_id,
      razorpay_payment_id: refund.payment_id,
      status: "success",
      receipt: refund.id
    });

    console.log(`✅ REFUND PROCESSED: Booking ${bookingId} refunded ${refund.amount / 100} INR.`);

    return res.status(200).json({
      success: true,
      message: "Payment refunded successfully and booking cancelled.",
      refund
    });

  } catch (error) {
    console.error("❌ REFUND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to issue Razorpay refund.",
      error: error.message
    });
  }
};

/**
 * @desc    Asynchronous Webhook Listener for Razorpay events (Background Synchronization)
 * @route   POST /api/payment/webhook
 * @access  Public
 */
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const signature = shasum.digest("hex");

      if (signature !== req.headers["x-razorpay-signature"]) {
        console.warn("⚠️ WEBHOOK INTEGRITY WARNING: Invalid webhook signature!");
        return res.status(400).json({ message: "Invalid signature" });
      }
    }

    const event = req.body.event;
    console.log(`🔔 RAZORPAY WEBHOOK RECEIVED: Event: ${event}`);

    // Parse payload details
    const paymentEntity = req.body.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const paymentMethod = paymentEntity.method;

    if (event === "payment.captured") {
      // Background Sync success
      const transaction = await Transaction.findOneAndUpdate(
        { razorpay_order_id: orderId },
        { status: "success", razorpay_payment_id: paymentId, paymentMethod },
        { new: true }
      );

      if (transaction) {
        await Booking.findByIdAndUpdate(transaction.booking, {
          paymentStatus: "paid",
          bookingStatus: "confirmed",
          razorpay_payment_id: paymentId
        });
      }
    } else if (event === "payment.failed") {
      // Background Sync failure
      const transaction = await Transaction.findOneAndUpdate(
        { razorpay_order_id: orderId },
        { status: "failed", razorpay_payment_id: paymentId },
        { new: true }
      );

      if (transaction) {
        await Booking.findByIdAndUpdate(transaction.booking, {
          paymentStatus: "failed",
          bookingStatus: "failed"
        });
      }
    }

    return res.status(200).json({ status: "ok" });

  } catch (error) {
    console.error("❌ WEBHOOK PROCESSING ERROR:", error);
    return res.status(500).json({ message: "Webhook handler failed" });
  }
};
