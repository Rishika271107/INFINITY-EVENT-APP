const Event = require("../models/Event");
const cloudinary = require( "../config/cloudinary");


// CREATE EVENT
// CREATE EVENT
exports.createEvent = async (
  req,
  res
) => {
  try {

    const {
      title,
      description,
      date,
      location,
      price
    } = req.body;

    let imageUrl = "";



    // IMAGE UPLOAD
    if (req.file) {

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "infinity-events"
          }
        );

      imageUrl = result.secure_url;
    }



    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      image: imageUrl,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      event
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {

    const events = await Event.find();

    res.status(200).json({
      success: true,
      events
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// GET SINGLE EVENT
exports.getSingleEvent = async (
  req,
  res
) => {
  try {

    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// UPDATE EVENT
exports.updateEvent = async (
  req,
  res
) => {
  try {

    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const updatedEvent =
      await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.status(200).json({
      success: true,
      updatedEvent
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// DELETE EVENT
exports.deleteEvent = async (
  req,
  res
) => {
  try {

    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};