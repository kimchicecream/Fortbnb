const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// isProduction will be true if the environment is in production or not by checking the environment key
// in the configuration file (backend/config/index.js):
const { environment } = require('./config');
const isProduction = environment === 'production';

// initialize Express application
const app = express();

// connect morgan middleware for logging info about requests and responses
app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

// security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// backend/app.js
const routes = require('./routes');

// ...

app.use(routes); // connect all the routes

module.exports = app;
