
function computeImpact(currentlyInfected, data) {
  let days = null;
  const duration = data.timeToElapse;
  if (data.periodType === 'days') {
    days = duration;
  }
  if (data.periodType === 'weeks') {
    days = duration * 7;
  }
  if (data.periodType === 'months') {
    days = duration * 30;
  }

  const { avgDailyIncomePopulation, avgDailyIncomeInUSD, totalHospitalBeds } = data;

  const factor = Math.floor(days / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  const severeCasesByRequestedTime = Math.floor(0.15 * infectionsByRequestedTime);
  const temp1 = (0.35 * totalHospitalBeds) - severeCasesByRequestedTime;
  const hospitalBedsByRequestedTime = Math.floor(temp1);
  const casesForICUByRequestedTime = 0.05 * infectionsByRequestedTime;
  const casesForVentilatorsByRequestedTime = 0.02 * infectionsByRequestedTime;

  const d = infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * days;

  const output = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight: d
  };
  return output;
}

const covid19ImpactEstimator = (data) => {
  const currentlyInfected = data.reportedCases * 10;
  const currentlyInfectedSevere = data.reportedCases * 50;
  const output = {
    data,
    impact: computeImpact(currentlyInfected, data),
    severeImpact: computeImpact(currentlyInfectedSevere, data)
  };
  return output;
};

module.exports = covid19ImpactEstimator;
// export default covid19ImpactEstimator;
