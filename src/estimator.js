// normalize the duration to days
const normalizeToDays = (data) => {
  let days;
  if (data.periodType === 'days') {
    days = 2 ** (Math.floor(data.timeToElapse / 3));
  } else if (data.periodType === 'weeks') {
    days = 2 ** (Math.floor((data.timeToElapse * 7) / 3));
  } else {
    days = 2 ** (Math.floor((data.timeToElapse * 30) / 3));
  }
  return days;
};

const covid19ImpactEstimator = (data) => {
  const input = data;
  const days = normalizeToDays(data);
  const result = {
    data: input, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
  };
  // currently infected
  result.impact.currentlyInfected = data.reportedCases * 10;
  result.severeImpact.currentlyInfected = data.reportedCases * 50;

  // infection by requested time
  result.impact.infectionsByRequestedTime = result.impact.currentlyInfected * days;
  result.severeImpact.infectionsByRequestedTime = result.severeImpact.currentlyInfected * days;

  // severe cases by requested time
  result.impact.severeCasesByRequestedTime = 0.15 * result.impact.infectionsByRequestedTime;
  result
    .severeImpact.severeCasesByRequestedTime = 0.15 * result.severeImpact.infectionsByRequestedTime;

  // hospital beds by requested time
  result
    .impact.hospitalBedsByRequestedTime = parseInt((0.35 * data.totalHospitalBeds)
    - result.impact.severeCasesByRequestedTime, 0);
  result.severeImpact.hospitalBedsByRequestedTime = parseInt((0.35 * data.totalHospitalBeds)
  - result.severeImpact.severeCasesByRequestedTime, 0);

  // cases for ICU by requested time
  result.impact.casesForICUByRequestedTime = parseInt(
    result.impact.infectionsByRequestedTime - (0.05 * result.impact.infectionsByRequestedTime), 0
  );
  result.severeImpact.casesForICUByRequestedTime = parseInt(
    result.severeImpact.infectionsByRequestedTime - (0.05
    * result.severeImpact.infectionsByRequestedTime), 0
  );

  // cases for ventilators by requested time
  result.impact.casesForVentilatorsByRequestedTime = parseInt(
    result.impact.infectionsByRequestedTime - (0.02 * result.impact.infectionsByRequestedTime), 0
  );
  result.severeImpact.casesForVentilatorsByRequestedTime = parseInt(
    result.severeImpact.infectionsByRequestedTime - (0.02
    * result.severeImpact.infectionsByRequestedTime), 0
  );

  // dollars in flight
  result.impact.dollarsInFlight = result.impact.infectionsByRequestedTime
  * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * days;
  result.severeImpact.dollarsInFlight = result.severeImpact.infectionsByRequestedTime
  * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * days;

  return result;
};


// const data = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };
// console.log(covid19ImpactEstimator(data));
export default covid19ImpactEstimator;
