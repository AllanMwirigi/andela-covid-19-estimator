
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const controllers = require('./src/controllers');
require('dotenv').config();

const app = express();

// create a write stream (in append mode)
const writeStream = fs.createWriteStream(path.join(__dirname, '/logs/app.log'), { flags: 'a', encoding: 'utf8' });

// logging
// app.use(morgan('dev'));
// app.use(morgan('tiny', { stream: winston.stream }));
const logFormat = '":method \t :url \t :status \t :response-time ms"';
app.use(morgan(logFormat, { stream: writeStream }));

// parse request bodies //support nested json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.post('/api/v1/on-covid-19', controllers.evalCovidJSON);
app.post('/api/v1/on-covid-19/json', controllers.evalCovidJSON);
app.post('/api/v1/on-covid-19/xml', controllers.evalCovidXML);
app.get('/api/v1/on-covid-19/logs', controllers.getLogs);
app.get('/api/v1/logs', controllers.getLogs);
app.get('/api/logs', controllers.getLogs);
app.get('/logs', controllers.getLogs);


// app.get('/api/v1/on-covid-19/xml', controllers.getXML);

// port  // heroku will set PORT env var to 80
if (process.env.NODE_ENV === 'development') {
  app.listen(process.env.PORT).on('listening', () => {});
} else {
  app.listen(process.env.PORT, process.env.HOST_IP).on('listening', () => {});
}

// custom error handling middleware i.e. for errors passed in next()
app.use((err, req, res, next) => {
  // TODO:log these errors
  if (res.headersSent) {
    // express handles the error if headers had already been sent and sth went wrong
    next(err);
    return;
  }

  // include winston logging
  // winston.error(`${req.method} \t\t ${req.url} \t\t ${err.status || 500}`);
  // console.log('error', err);

  // set status to the status code of the error, otherwise 500 is default e.g. for db errors
  res.set({ 'Content-type': 'application/json' });
  res.status(err.status || 500);
  res.json({ message: err.message });
});
