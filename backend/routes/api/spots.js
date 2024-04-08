const express = require('express');
const { User, Spot, Review, SpotImage, ReviewImage, Booking} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const router = express.Router();

const queryValidations = [
    check('page')
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1')
        .isInt({ max: 10 })
        .withMessage('Page must be less than or equal to 10'),
    check('size')
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1')
        .isInt({ max: 20 })
        .withMessage('Size must be less than or equal to 20'),
    handleValidationErrors
]
// Get all spots /api/spots
router.get('/', queryValidations, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;

    const offset = (page - 1) * size;

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


    const paginatedSpots = spots.slice(offset, offset + size);

    const formattedSpots = paginatedSpots.map(spot => ({
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
        Spots: formattedSpots,
        page: page,
        size: size
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
        group: ['Spot.id', 'SpotImages.id', 'User.id', 'Reviews.id']
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
        .withMessage('Latitude is not valid')
        .custom((value) => {
            const latitude = parseFloat(value);
            if (latitude < -90 || latitude > 90) {
                throw new Error('Latitude must be within -90 to 90');
            }
            return true;
        }),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required')
        .isNumeric()
        .withMessage('Longitude is not valid')
        .custom((value) => {
            const longitude = parseFloat(value);
            if (longitude < -180 || longitude > 180) {
                throw new Error('Longitude must be within -180 to 180');
            }
            return true;
        }),
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

    if (!spotId) {
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
        return res.status(500).json({
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
        .withMessage('Invalid start date format')
        .custom((value) => {
            const currentDate = new Date();
            if (new Date(value) < currentDate) {
                throw new Error('Start date cannot be in the past');
            }
            return true;
        }),
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
        })
        .custom((value, { req }) => {
            const startDate = req.body.startDate;
            const endDate = new Date(value);
            if (startDate === value) {
                throw new Error('Start and end date cannot be the same');
            }
            if (endDate <= new Date(startDate)) {
                throw new Error('End date cannot be before start date');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            if (errorMessages.includes('Start and end date cannot be the same') || errorMessages.includes('End date cannot be before start date')) {
                return res.status(400).json({
                    message: 'Bad Request',
                    errors: {
                        endDate: 'endDate cannot be on or before startDate'
                    }
                });
            }
            return res.status(400).json({
                message: 'Bad request',
                errors: {
                    startDate: 'startDate cannot be in the past'
                }
            });
        }
        next();
    },
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

    const existingBooking = await Booking.findOne({
        where: {
            spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    [Op.and]: [
                        { startDate: { [Op.lte]: startDate } },
                        { endDate: { [Op.gte]: endDate } }
                    ]
                }
            ]
        }
    });

    if (existingBooking) {
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
        id: booking.id,
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

// Add Query Filters to get all Spots
// router.get('/', queryValidations, async (req, res) => {
//     let { page, size} = req.query;

//     page = parseInt(page) || 1;
//     size = parseInt(size) || 20;

//     // const where = {};
//     // if (minLat && maxLat) where.lat = { [Op.between]: [minLat, maxLat] };
//     // if (minLng && maxLng) where.lng = { [Op.between]: [minLng, maxLng] };
//     // if (minPrice && maxPrice) where.price = { [Op.between]: [minPrice, maxPrice] };

//     // const offset = (page - 1) * size;
//     // const spots = await Spot.findAll({
//     //     where,
//     //     limit: size,
//     //     offset
//     // });

//     const spots = await Spot.findAll({
//         offset: (page - 1) * size,
//         limit: size
//     })

//     res.status(200).json({
//         Spots: spots,
//         page: page,
//         size: size
//     });
// });

module.exports = router;
