const covid19ImpactEstimator = (data) => {
  const input = data;
  const result = {
    data: input, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
  };
  // currently infected
  result.impact.currentlyInfected = data.reportedCases * 10;
  result.severeImpact.currentlyInfected = data.reportedCases * 50;

  // infection by requested time
  result.impact.infectionsByRequestedTime = result.impact.currentlyInfected * 512;
  result.severeImpact.infectionsByRequestedTime = result.severeImpact.currentlyInfected * 512;

  // severe cases by requested time
  result.impact.severeCasesByRequestedTime = 0.15 * result.impact.infectionsByRequestedTime;
  result
    .severeImpact.severeCasesByRequestedTime = 0.15 * result.severeImpact.infectionsByRequestedTime;

  // hospital beds by requested time
  result
    .impact.hospitalBedsByRequestedTime = Math.round((0.35 * data.totalHospitalBeds)
     - result.impact.severeCasesByRequestedTime);
  result.severeImpact.hospitalBedsByRequestedTime = Math.round((0.35 * data.totalHospitalBeds)
  - result.severeImpact.severeCasesByRequestedTime);

  // cases for ICU by requested time
  result.impact.casesForICUByRequestedTime = 0.05 * result.impact.infectionsByRequestedTime;
  result.severeImpact.casesForICUByRequestedTime = 0.05
  * result.severeImpact.infectionsByRequestedTime;

  // cases for ventilators by requested time
  result.impact.casesForVentilatorsByRequestedTime = 0.02 * result.impact.infectionsByRequestedTime;
  result.severeImpact.casesForVentilatorsByRequestedTime = 0.02
  * result.severeImpact.infectionsByRequestedTime;

  // dollars in flight
  result.impact.dollarsInFlight = result.impact.infectionsByRequestedTime
  * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * 30;
  result.severeImpact.dollarsInFlight = result.severeImpact.infectionsByRequestedTime
  * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * 30;

  return result;
};

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
// covid19ImpactEstimator(data);
export default covid19ImpactEstimator;
