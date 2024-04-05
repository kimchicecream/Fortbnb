const express = require('express');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id;

        // Find all reviews written by the current user
        const reviews = await Review.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        const formattedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.User.id,
                firstName: review.User.firstName,
                lastName: review.User.lastName
            },
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                state: review.Spot.state,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.previewImage || null
            },
            ReviewImages: [{
                id: ReviewImage.id || null,
                url: ReviewImage.url || null
            }]
        }));

        res.status(200).json({
            Reviews: formattedReviews
        });
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({
        where: { id: reviewId, userId }
    });
    if (!review) {
        res.status(404).json({
            message: "Review couldn't be found"
        });
    }

    const imageCount = await ReviewImage.count({
        where: { reviewId }
    });
    if (imageCount >= 10) {
        res.status(403).json({
            message: 'Maximum number of images for this resource was reached'
        });
    }

    const newImage = await ReviewImage.create({ reviewId, url });
    res.status(200).json({
        id: newImage.id, url: newImage.url
    });
});

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const reviewExists = await Review.findOne({
        where: { id: reviewId, userId }
    });
    if (!reviewExists) {
        res.status(404).json({
            message: "Review couldn't be found"
        });
    }

    reviewExists.review = review;
    reviewExists.stars = stars;
    await reviewExists.save();

    res.status(200).json(reviewExists);
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const reviewExists = await Review.findOne({
        where: { id: reviewId, userId }
    });
    if (!reviewExists) {
        res.status(404).json({
            message: "Review couldn't be found"
        });
    }

    await reviewExists.destroy();

    res.status(200).json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
