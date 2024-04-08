const express = require('express');
const bcrypt = require('bcryptjs');

const{ setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide your first name.')
        .isLength({ min: 1 })
        .withMessage('First name must have at least 1 character.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide your last name.')
        .isLength({ min: 1 })
        .withMessage('Last name must have at least 1 character.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const userWithEmail = await User.findOne({ where: { email } });
    if (userWithEmail) {
        return res.status(500).json({
            message: 'User already exists',
            errors: { email: 'User with that email already exists' }
        });
    }

    const userWithUsername = await User.findOne({ where: { username } });
    if (userWithUsername) {
        return res.status(500).json({
            message: 'User already exists',
            errors: { username: 'User with that username already exists' }
        });
    }

    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

module.exports = router;
