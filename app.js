const { application } = require('express');
const express = require('express');
const morgan = require('morgan');
const ErrorManager = require('./utils/errorManager');
const globalErrorHandler = require('./controllers/errorController')

const locationRouter = require('./routes/locationRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime)
  next();
});

app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new ErrorManager(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

module.exports = app;