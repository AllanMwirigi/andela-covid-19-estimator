
const path = require('path');
// const fs = require('fs');
const covid19ImpactEstimator = require('./estimator');
const xmlParser = require('../utils/fast-xml-parser');

const appRoot = path.dirname(require.main.filename); // will fail if using a launcher like pm2

exports.evalCovidJSON = (req, res, next) => {
  try {
    // console.dir(req);
    const data = req.body;
    if (data == null) {
      res.sendStatus(400); return;
    }
    const output = covid19ImpactEstimator(data);
    res.type('application/json');
    res.status(200).json(output);
  } catch (error) {
    next(error);
  }
};

exports.evalCovidXML = (req, res, next) => {
  try {
    const data = req.body;
    if (data == null) {
      res.sendStatus(400); return;
    }
    const output = covid19ImpactEstimator(data);
    // xml requires that there is only a single root element
    const xmlOutput = xmlParser.parse({ root: output });
    res.set('Content-Type', 'application/xml');
    res.status(200);
    res.send(xmlOutput);
  } catch (error) {
    next(error);
  }
};

exports.getLogs = (req, res) => {
  res.status(200);
  res.sendFile(`${appRoot}/logs/app.log`);
  // const text = fs.readFileSync(`${appRoot}/logs/app.log`, 'utf8');
  // res.status(200).set('Content-Type', 'text/plain').send(text);

  // const t = 'GET /api/v1/on-covid-19/logs 200 45ms\n';
  // res.status(200).set('Content-Type', 'text/plain').send(t.repeat(4));
};

exports.getXML = (req, res) => {
  const data = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  };
  const xmlOutput = xmlParser.parse({ root: data });
  res.set('Content-Type', 'application/xml');
  res.status(200);
  res.send(xmlOutput);
};
