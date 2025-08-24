import Booking from '../models/bookingModel.js';
import Tool from '../models/toolModel.js';
import { io, activeUsers } from '../index.js';


export const createBookingRequest = async (req, res, next) => {
  const { toolId, startDate, endDate } = req.body;
  const borrowerId = req.user._id;

  try {
    const tool = await Tool.findById(toolId);
    if (!tool) {
      res.status(404);
      throw new Error('Tool not found');
    }

    if (tool.owner.toString() === borrowerId.toString()) {
      res.status(400);
      throw new Error('You cannot book your own tool');
    }
    
    const booking = await Booking.create({
      tool: toolId,
      borrower: borrowerId,
      owner: tool.owner,
      startDate,
      endDate,
    });

    // --- THIS IS THE FIX ---
    // Get the owner's full info object from activeUsers
    const ownerInfo = activeUsers[tool.owner.toString()];
    if (ownerInfo) {
      // Use the .socketId property to send the notification
      io.to(ownerInfo.socketId).emit('new_booking_request', {
        message: `You have a new booking request for your tool: ${tool.name}`,
        bookingDetails: booking,
      });
      console.log(`Notification sent to owner ${tool.owner}`);
    } else {
      console.log(`Owner ${tool.owner} is not online.`);
    }
    // --- END OF FIX ---

    res.status(201).json(booking);
  } catch (error) {
    next(error); 
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [{ borrower: req.user._id }, { owner: req.user._id }],
    })
    .populate('tool', 'name imageUrl')
    .populate('borrower', 'name')
    .populate('owner', 'name')
    .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  const { status } = req.body; 

  try {
    const booking = await Booking.findById(req.params.id).populate('tool', 'name');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }
    
    if (booking.owner.toString() !== req.user._id.toString()) {
      res.status(401); 
      throw new Error('User not authorized to update this booking');
    }

    booking.status = status;
    await booking.save();
    
    // Your excellent logic to make the tool unavailable
    if (status === 'approved') {
        const tool = await Tool.findById(booking.tool._id);
        if (tool) {
            tool.availability = false;
            await tool.save();
        }
    }

    // --- THIS IS THE FIX ---
    // Get the borrower's full info object
    const borrowerInfo = activeUsers[booking.borrower.toString()];
    if (borrowerInfo) {
      // Use the .socketId property to send the notification
      io.to(borrowerInfo.socketId).emit('booking_status_updated', {
        message: `Your request for "${booking.tool.name}" has been ${status}.`,
        bookingDetails: booking,
      });
      console.log(`Notification sent to borrower ${booking.borrower}`);
    } else {
      console.log(`Borrower ${booking.borrower} is not online.`);
    }
    // --- END OF FIX ---

    res.json(booking);
  } catch (error) {
    next(error);
  }
};