const Reminder = require("../models/Reminder");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get user's reminders
 * @route   GET /api/reminders
 * @access  Private
 */
exports.getReminders = asyncHandler(async (req, res, next) => {
  const reminders = await Reminder.find({ user: req.user._id }).sort({ date: 1, time: 1 });

  res.status(200).json(
    new ApiResponse({
      message: "Reminders fetched successfully",
      data: reminders
    })
  );
});

/**
 * @desc    Add a new reminder
 * @route   POST /api/reminders
 * @access  Private
 */
exports.createReminder = asyncHandler(async (req, res, next) => {
  const { eventName, date, time } = req.body;

  if (!eventName || !date || !time) {
    return next(new ApiError(400, "Event name, date, and time are required."));
  }

  const reminder = await Reminder.create({
    user: req.user._id,
    eventName,
    date,
    time
  });

  res.status(201).json(
    new ApiResponse({
      message: "Reminder set successfully",
      data: reminder
    })
  );
});

/**
 * @desc    Delete a reminder
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
exports.deleteReminder = asyncHandler(async (req, res, next) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return next(new ApiError(404, "Reminder not found"));
  }

  if (reminder.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, "Not authorized to delete this reminder"));
  }

  await reminder.deleteOne();

  res.status(200).json(
    new ApiResponse({
      message: "Reminder deleted successfully",
      data: null
    })
  );
});
