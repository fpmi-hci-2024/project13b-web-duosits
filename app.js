var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.set('view engine', 'pug');
// Раздавать статические файлы из папки 'uploads'
app.use('/uploads', express.static('uploads'));

app.use('/api', require('./routes'));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "API Documentation", 
      version: "1.0.0", 
      description: "API для социальной сети", 
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', '*.js')], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', (req, res, next) => {
  console.log('Swagger UI requested');
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocs));console.log(swaggerDocs);
module.exports = app;
