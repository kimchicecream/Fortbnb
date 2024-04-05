const express = require('express');
const { User, Spot, Review, SpotImage, ReviewImage, Booking} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { imageId } = req.params;

    const spotImage = await SpotImage.findByPk(imageId);
    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        });
    }

    const spot = await Spot.findByPk(spotImage.spotId);
    if (spot.ownerId !== userId) {
        return res.status(403).json({
            message: "You are not authorized to delete this Spot Image"
        });
    }

    await spotImage.destroy();

    res.status(200).json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
