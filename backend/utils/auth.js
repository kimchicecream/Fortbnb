const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('..db/models');

const { secret, expiresIn } = jwtConfig;

// sends a JWT cookie
const setTokenCookie = (res, user) => {

    //create the token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    };

    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn)}
    );

    const isProduction = process.env.NODE_ENV === 'production';

    // set token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    });

    return token;
}
