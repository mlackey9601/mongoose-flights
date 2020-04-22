const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');

require('dotenv').config();
require('./config/database');

const indexRouter = require('./routes/index');
const flightsRouter = require('./routes/flights');
const destinationsRouter = require('./routes/destinations');
const ticketsRouter = require('./routes/tickets');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/flights', flightsRouter);
app.use('/', destinationsRouter);
app.use('/', ticketsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(` . . . Express backend services running on port ${port} . . . `)
});

module.exports = app;
