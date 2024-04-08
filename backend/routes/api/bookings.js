const express = require('express');
const { User, Spot, Review, SpotImage, ReviewImage, Booking} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
        where: { userId },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
        ],
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    });

    const formattedBookings = [];

    for(const booking of bookings) {
        const spot = await Spot.findByPk(booking.spotId);
        if (spot) {
            const spotData = {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                price: spot.price,
                previewImage: null
            };

            const spotImages = await spot.getSpotImages();
            if (spotImages.length > 0) {
                spotData.previewImage = spotImages[0].url;
            }

            formattedBookings.push({
                id: booking.id,
                spotId: booking.spotId,
                Spot: spotData,
                userId: booking.userId,
                startDate: booking.startDate.toISOString().split('T')[0],
                endDate: booking.endDate.toISOString().split('T')[0],
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            });
        }
    }

    res.status(200).json({
        Bookings: formattedBookings
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

router.put('/:bookingId', requireAuth, validateBookingDates, async (req, res) => {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findOne({
        where: { id: bookingId }
    });

    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        });
    }

    if (booking.userId !== userId) {
        return res.status(403).json({
            message: 'You are not authorized to make changes to this booking'
        });
    }

    const currentDate = new Date();
    if (new Date(booking.endDate) < currentDate) {
        return res.status(400).json({
            message: "Past bookings can't be modified"
        });
    }

    const bookingConflict = await Booking.findOne({
        where: {
            id: { [Op.ne]: bookingId },
            spotId: booking.spotId,
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

    if (bookingConflict) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.status(200).json({
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate.toISOString().split('T')[0],
        endDate: booking.endDate.toISOString().split('T')[0],
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    });
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
        where: { id: bookingId }
    });
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        });
    }

    const spot = await Spot.findOne({
        where: { id: booking.spotId }
    });
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    if (booking.userId !== userId && spot.ownerId !== userId) {
        return res.status(403).json({
            message: "You are not authorized to delete this booking"
        });
    }

    const currentDate = new Date();
    if (new Date(booking.startDate) < currentDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        });
    }

    await booking.destroy();

    res.status(200).json({
        message: "Successfully deleted"
    });
});

module.exports = router;
