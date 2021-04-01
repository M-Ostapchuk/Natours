const catchAsync = require('./../utiles/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./handlerController');

exports.setTourUserIds = (req, res, next) => {
    if(!req.body.tour) {
        req.body.tour = req.params.tourId
        req.body.user = req.user
    }

    next();
} 



exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);