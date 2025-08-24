import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import { activeUsers } from '../index.js';
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            // Get user's reviews as a reviewer and reviewee
            const userReviews = await Review.find({ reviewee: user._id });
            const averageRating = userReviews.length > 0 ? userReviews.reduce((acc, item) => acc + item.rating, 0) / userReviews.length : 0;
            user.trustScore = averageRating;

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                trustScore: user.trustScore.toFixed(1)
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createReview = async (req, res, next) => {
    const { bookingId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        if (booking.status !== 'completed') {
            res.status(400);
            throw new Error('Cannot review an uncompleted booking');
        }

        // Determine who the reviewee is based on who the reviewer is
        const revieweeId = booking.borrower.toString() === reviewerId.toString() ? booking.owner : booking.borrower;

        // Check if a review already exists for this booking
        const reviewExists = await Review.findOne({ booking: bookingId, reviewer: reviewerId });
        if (reviewExists) {
            res.status(400);
            throw new Error('You have already reviewed this booking');
        }

        const review = await Review.create({
            booking: bookingId,
            reviewer: reviewerId,
            reviewee: revieweeId,
            rating,
            comment,
        });

        // Update the reviewee's trust score
        const revieweeUser = await User.findById(revieweeId);
        if (revieweeUser) {
             const revieweeReviews = await Review.find({ reviewee: revieweeUser._id });
            const newAverageRating = revieweeReviews.reduce((acc, item) => acc + item.rating, 0) / revieweeReviews.length;
            revieweeUser.trustScore = newAverageRating;
            await revieweeUser.save();
        }

        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};


export const getOnlineUsers = (req, res) => {
  const onlineUsers = Object.keys(activeUsers).map(id => {
    const user = activeUsers[id];
    return {
      _id: id,
      name: user.name,
    };
  });
  res.json(onlineUsers);
};