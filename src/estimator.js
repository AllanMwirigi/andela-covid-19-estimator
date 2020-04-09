
const covid19ImpactEstimator = (data) => {
    const currentlyInfected = data.reportedCases*10;
    const currentlyInfectedSevere = data.reportedCases*50;
    const output = {
        data: data,
        impact: computeImpact(currentlyInfected, data),
        severeImpact: computeImpact(currentlyInfectedSevere, data)
    }
    return output;
}

function computeImpact(currentlyInfected, data){
    let days = null;
    let duration = data.timeToElapse;
    if(data.periodType === 'days'){
        days = duration;
    }
    if(data.periodType === 'weeks'){
        days = duration*7;
    }
    if(data.periodType === 'months'){
        days = duration*30;
    }
    const factor = Math.floor(days/3);
    const infectionsByRequestedTime = currentlyInfected*Math.pow(2, factor);
    const severeCasesByRequestedTime = Math.floor(0.15*infectionsByRequestedTime);
    const hospitalBedsByRequestedTime = Math.floor((0.35*data.totalHospitalBeds)-severeCasesByRequestedTime);
    const casesForICUByRequestedTime = 0.05*infectionsByRequestedTime;
    const casesForVentilatorsByRequestedTime = 0.02*infectionsByRequestedTime;
    const dollarsInFlight = infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * days;

    const output = {
        currentlyInfected: currentlyInfected,
        infectionsByRequestedTime: infectionsByRequestedTime,
        severeCasesByRequestedTime: severeCasesByRequestedTime,
        hospitalBedsByRequestedTime: hospitalBedsByRequestedTime,
        casesForICUByRequestedTime: casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime,
        dollarsInFlight: dollarsInFlight
    }
    return output;
}

module.exports = covid19ImpactEstimator;
// export default covid19ImpactEstimator;
