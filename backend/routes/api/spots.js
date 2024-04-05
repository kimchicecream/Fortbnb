const express = require('express');
const { User, Spot, Review, SpotImage, ReviewImage, Booking} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const router = express.Router();

// Get all spots /api/spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['stars'],
                required: false
            },
            {
                model: SpotImage,
                where: { preview: true },
                attributes: ['url'],
                required: false
            }
        ],
        group: ['Spot.id', 'Reviews.id', 'SpotImages.id'] // group to avoid dupe
    });

    const formattedSpots = spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: calculateAvgRating(spot.Reviews),
        previewImage: spot.SpotImages[0]?.url || null
    }));

    res.json({
        Spots: formattedSpots
    });
});

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id;
        const spots = await Spot.findAll({
            where: { ownerId: userId },
            include: [
                {
                    model: Review,
                    attributes: ['stars'],
                    required: false
                },
                {
                    model: SpotImage,
                    where: { preview: true },
                    attributes: ['url'],
                    required: false
                }
            ],
            group: ['Spot.id', 'Reviews.id', 'SpotImages.id'] // group to avoid dupe
        });

        const formattedSpots = spots.map(spot => ({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: calculateAvgRating(spot.Reviews),
            previewImage: spot.SpotImages[0]?.url || null,
        }));

        res.status(200).json({
            Spots: formattedSpots
        });
});

function calculateAvgRating(reviews) {
    if (!reviews || reviews.length === 0) return null;

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return totalStars / reviews.length;
};

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Review,
                attributes: ['stars']
            }
        ],
        group: ['Spot.id', 'SpotImages.id', 'User.id']
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    };

    const numReviews = spot.Reviews ? spot.Reviews.length : 0;
    const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, review) => acc + review.stars, 0) / numReviews : 0;

    const formattedSpots = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews,
        avgStarRating,
        SpotImages: spot.SpotImages.map(image => ({
            id: image.id,
            url: image.url,
            preview: image.preview
        })),
        Owner: {
            id: spot.User.id,
            firstName: spot.User.firstName,
            lastName: spot.User.lastName
        }
    };

    res.json(formattedSpots);
});

const validateSpotCreation = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is required')
        .isNumeric()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required')
        .isNumeric()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required')
        .isNumeric()
        .withMessage('Price must be a number')
        .isInt({ min: 1 })
        .withMessage('Price must be a valid positive integer'),
    handleValidationErrors
]

// Create a spot
router.post('/', requireAuth, validateSpotCreation, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const formattedLat = parseFloat(lat);
    const formattedLng = parseFloat(lng);
    const formattedPrice = parseFloat(price);

    const spot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat: formattedLat,
        lng: formattedLng,
        name,
        description,
        price: formattedPrice
    });

    return res.status(201).json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: formattedLat,
        lng: formattedLng,
        name: spot.name,
        description: spot.description,
        price: formattedPrice,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
    });
});

// Add an image to a Spot based on Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const spot = await Spot.findOne({
        where: { id: spotId }
    });

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'You are not authorized to add an image to this spot'
        });
    }

    const image = await SpotImage.create({
        spotId,
        url,
        preview
    });

    res.status(200).json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
});

// Edit a Spot
router.put('/:spotId', requireAuth, validateSpotCreation, async (req, res) => {
    const { spotId } = req.params;
    const{ address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findOne({
        where: { id: spotId }
    });

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'You are not authorized to make edits to this spot'
        });
    }

    await spot.update({
        address, city, state, country, lat, lng, name, description, price
    });

    res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
    });
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findOne({
        where: { id: spotId }
    });

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'You are not authorized to delete this spot'
        });
    }

    await spot.destroy();

    res.status(200).json({
        message: 'Successfully deleted'
    });
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    if (!reviews || reviews.length === 0) {
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

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
        ReviewImages: [{
            id: ReviewImage.id || null,
            url: ReviewImage.url || null
        }]
    }));

    res.status(200).json({
        Reviews: formattedReviews
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
]

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;
    const { review, stars } = req.body;

    const spot  = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    const reviewExists = await Review.findOne({
        where: { userId, spotId }
    });
    if (reviewExists) {
        return res.status(403).json({
            message: 'User already has a review for this spot'
        });
    }

    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    });

    const formattedSpotId = parseInt(spotId);

    return res.status(201).json({
        id: newReview.id,
        userId: newReview.userId,
        spotId: formattedSpotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
    });
});

const validateBookingDates = [
    check('startDate')
        .toDate()
        .isISO8601()
        .withMessage('Invalid start date format'),
    check('endDate')
        .toDate()
        .isISO8601()
        .withMessage('Invalid end date format')
        .custom((value, { req }) => {
            const startDate = req.body.startDate;
            if (!startDate) {
                throw new Error('Start date is required');
            }
            if (new Date(startDate) >= new Date(value)) {
                throw new Error('End date must be after the start date');
            }
            return true;
        }),
    handleValidationErrors
];


// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateBookingDates, async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    if (spot.ownerId === userId) {
        return res.status(403).json({
            message: 'You cannot book your own spot'
        });
    }

    const bookingExists = await Booking.findOne({
        where: {
            spotId,
            startDate: { [Op.lte]: new Date(startDate) },
            endDate: { [Op.gte]: new Date(endDate) }
        }
    });
    if (bookingExists) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        });
    }

    const booking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    });

    // use toISOString method to convert the startDate and endDate to ISO strings
    const formattedStartDate = booking.startDate.toISOString().split('T')[0];
    const formattedEndDate = booking.endDate.toISOString().split('T')[0];
    booking.startDate = formattedStartDate;
    booking.endDate = formattedEndDate;

    const bookingConfirmation = {
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    }

    res.status(200).json(bookingConfirmation);
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    let bookings;
    if (spot.ownerId === userId) {
        bookings = await Booking.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ],
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
        });
    } else {
        bookings = await Booking.findAll({
            where: { spotId },
            attributes: ['spotId', 'startDate', 'endDate']
        });
    }

    let formattedBooking;
    const formattedBookings = bookings.map(booking => {
        formattedBooking = {
            spotId: booking.spotId,
            startDate: booking.startDate.toISOString().split('T')[0],
            endDate: booking.endDate.toISOString().split('T')[0]
        };

        if (spot.ownerId === userId) {
            formattedBooking = {
                User: {
                    id: booking.User.id,
                    firstName: booking.User.firstName,
                    lastName: booking.User.lastName
                },
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: booking.startDate.toISOString().split('T')[0],
                endDate: booking.endDate.toISOString().split('T')[0],
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
        }

        return formattedBooking;
    });

    res.status(200).json({
        Bookings: formattedBookings
    });
});

const queryValidations = [
    check('page')
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .optional()
        .isDecimal()
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional()
        .isDecimal()
        .withMessage('Minimum latitude is invalid'),
    check('minLng')
        .optional()
        .isDecimal()
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .isDecimal()
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional()
        .isDecimal({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isDecimal({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
]

// Add Query Filters to get all Spots
router.get('/', queryValidations, async (req, res) => {
    let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    const query = {};
    if (minLat && maxLat) query.lat = { [Op.between]: [minLat, maxLat] };
    if (minLng && maxLng) query.lng = { [Op.between]: [minLng, maxLng] };
    if (minPrice && maxPrice) query.price = { [Op.between]: [minPrice, maxPrice] };

    const offset = (page - 1) * size;
    const spots = await Spot.findAll({
        where: query,
        limit: size,
        offset: offset
    });

    res.status(200).json({
        Spots: spots,
        page: parseInt(page),
        size: parseInt(size)
    });
});

module.exports = router;
