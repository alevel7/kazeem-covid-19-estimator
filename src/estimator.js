// normalize the duration to days
const normalizeToDays = (data) => {
  let days;
  if (data.periodType === 'days') {
    days = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    days = data.timeToElapse * 7;
  } else {
    days = data.timeToElapse * 30;
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
  result.impact.infectionsByRequestedTime = Math.trunc(
    result.impact.currentlyInfected * (2 ** Math.trunc(days / 3))
  );
  result.severeImpact.infectionsByRequestedTime = Math.trunc(
    result.severeImpact.currentlyInfected * (2 ** Math.trunc(days / 3))
  );

  // severe cases by requested time
  result.impact.severeCasesByRequestedTime = Math.trunc(
    0.15 * result.impact.infectionsByRequestedTime
  );
  result.severeImpact.severeCasesByRequestedTime = Math.trunc(
    0.15 * result.severeImpact.infectionsByRequestedTime
  );

  // hospital beds by requested time
  result
    .impact.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
      - result.impact.severeCasesByRequestedTime);
  result.severeImpact.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
    - result.severeImpact.severeCasesByRequestedTime);

  // cases for ICU by requested time
  result.impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * result.impact.infectionsByRequestedTime
  );
  result.severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * result.severeImpact.infectionsByRequestedTime
  );

  // cases for ventilators by requested time
  result.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * result.impact.infectionsByRequestedTime
  );
  result.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * result.severeImpact.infectionsByRequestedTime
  );

  // dollars in flight
  result.impact.dollarsInFlight = Math.trunc((result.impact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / days);
  result.severeImpact.dollarsInFlight = Math.trunc((result.severeImpact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / days);

  return result;
};

export default covid19ImpactEstimator;
