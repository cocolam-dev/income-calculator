import FYData from "./FYData";

const calculationFromBase = (
  enteredValue,
  newSuperRate,
  newNumDayOff,
  newYear,
  hourlyBase,
  setHourly,
  setDaily,
  setWeekly,
  setFortnightly,
  setMonthly,
  setYearly,
  GST,
  isContract,
  arrayName,
  i
) => {
  let newHourly = [];
  let newDaily = [];
  let newWeekly = [];
  let newFortnightly = [];
  let newMonthly = [];
  let newYearly = [];
  let arrayGroup = {
    newHourly,
    newDaily,
    newWeekly,
    newFortnightly,
    newMonthly,
    newYearly,
  };

  let FactorOfReductionByDaysOff = 0;

  isContract && hourlyBase > 0
    ? (FactorOfReductionByDaysOff = 1 - newNumDayOff / 260)
    : (FactorOfReductionByDaysOff = 1);

  //===HOURLY===
  //calculate new hourly base income
  newHourly[2] = parseFloat(hourlyBase);
  //calculate new hourly super
  newHourly[3] = parseFloat(hourlyBase) * newSuperRate;
  //calculate new hourly package
  newHourly[4] = parseFloat(newHourly[2]) + parseFloat(newHourly[3]);
  //calculate new hourly GST
  newHourly[5] = parseFloat(newHourly[4]) * parseFloat(GST);
  //calculate new hourly total
  newHourly[6] = parseFloat(newHourly[4]) + parseFloat(newHourly[5]);

  //===DAILY===
  //base income
  newDaily[2] = parseFloat(hourlyBase * 8);
  //super
  newDaily[3] = newDaily[2] * newSuperRate;
  //package
  newDaily[4] = parseFloat(newDaily[2]) + parseFloat(newDaily[3]);
  //GST
  newDaily[5] = parseFloat(newDaily[4]) * parseFloat(GST);
  //Total
  newDaily[6] = parseFloat(newDaily[4]) + parseFloat(newDaily[5]);

  //===WEEKLY===
  //base income
  newWeekly[2] = parseFloat(hourlyBase * 8 * 5);
  //super
  newWeekly[3] = newWeekly[2] * newSuperRate;
  //package
  newWeekly[4] = parseFloat(newWeekly[2]) + parseFloat(newWeekly[3]);
  //GST
  newWeekly[5] = parseFloat(newWeekly[4]) * parseFloat(GST);
  //Total
  newWeekly[6] = parseFloat(newWeekly[4]) + parseFloat(newWeekly[5]);

  //===FORTNIGHTLY===
  //base income
  newFortnightly[2] = parseFloat(hourlyBase * 8 * 5 * 2);
  //super
  newFortnightly[3] = newFortnightly[2] * newSuperRate;
  //package
  newFortnightly[4] =
    parseFloat(newFortnightly[2]) + parseFloat(newFortnightly[3]);
  //GST
  newFortnightly[5] = parseFloat(newFortnightly[4]) * parseFloat(GST);
  //Total
  newFortnightly[6] =
    parseFloat(newFortnightly[4]) + parseFloat(newFortnightly[5]);

  //===MONTHLY===
  //base income
  newMonthly[2] = parseFloat((hourlyBase * 8 * 5 * 52) / 12);
  //super
  newMonthly[3] = newMonthly[2] * newSuperRate;
  //package
  newMonthly[4] = parseFloat(newMonthly[2]) + parseFloat(newMonthly[3]);
  //GST
  newMonthly[5] = parseFloat(newMonthly[4]) * parseFloat(GST);
  //Total
  newMonthly[6] = parseFloat(newMonthly[4]) + parseFloat(newMonthly[5]);

  //===YEARLY===
  //base income
  newYearly[2] = parseFloat(
    hourlyBase * 8 * 5 * 52 * FactorOfReductionByDaysOff
  );
  //super
  newYearly[3] = newYearly[2] * newSuperRate;
  //package
  newYearly[4] = parseFloat(newYearly[2]) + parseFloat(newYearly[3]);
  //GST
  newYearly[5] = parseFloat(newYearly[4]) * parseFloat(GST);
  //Total
  newYearly[6] = parseFloat(newYearly[4]) + parseFloat(newYearly[5]);

  //==============================================

  //calculate income tax [1] - with incomeTaxRate objects

  let taxBrackets = FYData[newYear].taxBrackets;

  let yearlyBase = newMonthly[2] * 12;

  for (let i = 0; i < taxBrackets.length; i++) {
    const taxBracket = taxBrackets[i];
    if (
      yearlyBase > taxBracket.min &&
      (yearlyBase <= taxBracket.max || i === taxBrackets.length - 1)
    ) {
      newMonthly[1] = (
        (taxBracket.flat +
          taxBracket.percent * (yearlyBase - taxBracket.over)) /
        12
      ).toFixed();
      break;
    }
  }

  //==============================================
  //calculate income tax [1] -- hardcoded tax rates
  // if (newMonthly[2] * 12 < 18200) {
  //   newHourly[1] = 0;
  //   newDaily[1] = 0;
  //   newWeekly[1] = 0;
  //   newFortnightly[1] = 0;
  //   newMonthly[1] = 0;
  //   newYearly[1] = 0;
  // } else if (newMonthly[2] * 12 > 18200 && newMonthly[2] * 12 <= 45000) {
  //   newMonthly[1] = (0.19 * (parseFloat(newMonthly[2]) * 12 - 18200)) / 12;
  // } else if (newMonthly[2] * 12 > 45000 && newMonthly[2] * 12 <= 120000) {
  //   newMonthly[1] =
  //     (5092 + 0.325 * (parseFloat(newMonthly[2]) * 12 - 45000)) / 12;
  // } else if (newMonthly[2] * 12 > 120000 && newMonthly[2] * 12 <= 180000) {
  //   newMonthly[1] = (
  //     (29467 + 0.37 * (parseFloat(newMonthly[2]) * 12 - 120000)) /
  //     12
  //   ).toFixed();
  // } else if (newMonthly[2] * 12 > 180000) {
  //   newMonthly[1] = (
  //     (51667 + 0.45 * (parseFloat(newMonthly[2]) * 12 - 180000)) /
  //     12
  //   ).toFixed();
  // }

  //==============================================

  newHourly[1] = (parseFloat(newMonthly[1]) * 12) / 52 / 5 / 8;
  newDaily[1] = parseFloat(newHourly[1]) * 8;
  newWeekly[1] = parseFloat(newHourly[1]) * 8 * 5;
  newFortnightly[1] = parseFloat(newHourly[1]) * 8 * 5 * 2;
  newMonthly[1] = (parseFloat(newHourly[1]) * 8 * 5 * 52) / 12;
  newYearly[1] = parseFloat(newDaily[1]) * 5 * 52 * FactorOfReductionByDaysOff;

  //==============================================

  //calculate after-tax income [0]
  newHourly[0] = parseFloat(newHourly[2]) - parseFloat(newHourly[1]);
  newDaily[0] = parseFloat(newDaily[2]) - parseFloat(newDaily[1]);
  newWeekly[0] = parseFloat(newWeekly[2]) - parseFloat(newWeekly[1]);
  newFortnightly[0] =
    parseFloat(newFortnightly[2]) - parseFloat(newFortnightly[1]);
  newMonthly[0] = parseFloat(newMonthly[2]) - parseFloat(newMonthly[1]);
  newYearly[0] = parseFloat(newYearly[2]) - parseFloat(newYearly[1]);

  if (arrayName) {
    arrayGroup[arrayName][i] = enteredValue;
  }

  for (let i = 0; i <= 6; i++) {
    newHourly[i] = parseFloat(newHourly[i]).toFixed();
    newDaily[i] = parseFloat(newDaily[i]).toFixed();
    newWeekly[i] = parseFloat(newWeekly[i]).toFixed();
    newFortnightly[i] = parseFloat(newFortnightly[i]).toFixed();
    newMonthly[i] = parseFloat(newMonthly[i]).toFixed();
    newYearly[i] = parseFloat(newYearly[i]).toFixed();
  }

  setHourly(newHourly);
  setDaily(newDaily);
  setWeekly(newWeekly);
  setFortnightly(newFortnightly);
  setMonthly(newMonthly);
  setYearly(newYearly);
};

export default calculationFromBase;
