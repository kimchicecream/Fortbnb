const express = require('express');
const { User, Spot, Review, SpotImage, sequelize} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots /api/spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: [
                    [sequelize.literal('AVG("Reviews"."stars")'), 'avgRating']
                ],
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
        avgRating: spot.Reviews[0]?.dataValues.avgRating || null,
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
                    attributes: [
                        [sequelize.literal('AVG("Reviews"."stars")'), 'avgRating']
                    ],
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
            avgRating: spot.Reviews[0]?.dataValues.avgRating || null,
            previewImage: spot.SpotImages[0]?.url || null,
        }));

        res.status(200).json({
            Spots: formattedSpots
        });
});

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
        .withMessage('Price must be a number'),
    handleValidationErrors
]

// Create a spot
router.post('/', requireAuth, validateSpotCreation, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({
        ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price
    });

    return res.status(201).json({
        spot
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

module.exports = router;
