const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review must not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to tour']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

reviewSchema.index({tour: 1, user: 1}, {unique: true});


reviewSchema.statics.calcAverageRatings = async function(tourId) {
   const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])

    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        });
    }
}

reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.tour);

});

reviewSchema.pre(/^findByIdAnd/, async function(next) {
    this.r = await this.find();
    next();
});

reviewSchema.post(/^findByIdAnd/, async function() {
    this.r.constructor.calcAverageRatings(this.r.tour)
})

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'user',
    //     select: 'name photo'
    // }).populate({
    //     path: 'tour',
    //     select: 'name'
    // })

    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;