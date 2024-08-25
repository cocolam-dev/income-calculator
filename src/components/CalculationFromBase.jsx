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
  let newHourly = {};
  let newDaily = {};
  let newWeekly = {};
  let newFortnightly = {};
  let newMonthly = {};
  let newYearly = {};
  let arrayGroup = {
    newHourly,
    newDaily,
    newWeekly,
    newFortnightly,
    newMonthly,
    newYearly,
  };


  let  factorOfReductionByDaysOff = 0;

  isContract && hourlyBase > 0
    ? (factorOfReductionByDaysOff = 1 - newNumDayOff / 260)
    : (factorOfReductionByDaysOff = 1);

  //===HOURLY===
  //calculate new hourly base income
  newHourly.baseIncome = parseFloat(hourlyBase);
  //calculate new hourly super
  newHourly.super = parseFloat(hourlyBase) * newSuperRate;
  //calculate new hourly package
  newHourly.package = parseFloat(newHourly.baseIncome) + parseFloat(newHourly.super);
  //calculate new hourly GST
  newHourly.gst = parseFloat(newHourly.package) * parseFloat(GST);
  //calculate new hourly total
  newHourly.total = parseFloat(newHourly.package) + parseFloat(newHourly.gst);

  //===DAILY===
  //base income
  newDaily.baseIncome = parseFloat(hourlyBase * 8);
  //super
  newDaily.super = newDaily.baseIncome * newSuperRate;
  //package
  newDaily.package = parseFloat(newDaily.baseIncome) + parseFloat(newDaily.super);
  //GST
  newDaily.gst = parseFloat(newDaily.package) * parseFloat(GST);
  //Total
  newDaily.total = parseFloat(newDaily.package) + parseFloat(newDaily.gst);

  //===WEEKLY===
  //base income
  newWeekly.baseIncome = parseFloat(hourlyBase * 8 * 5);
  //super
  newWeekly.super = newWeekly.baseIncome * newSuperRate;
  //package
  newWeekly.package = parseFloat(newWeekly.baseIncome) + parseFloat(newWeekly.super);
  //GST
  newWeekly.gst = parseFloat(newWeekly.package) * parseFloat(GST);
  //Total
  newWeekly.total = parseFloat(newWeekly.package) + parseFloat(newWeekly.gst);

  //===FORTNIGHTLY===
  //base income
  newFortnightly.baseIncome = parseFloat(hourlyBase * 8 * 5 * 2);
  //super
  newFortnightly.super = newFortnightly.baseIncome * newSuperRate;
  //package
  newFortnightly.package =
    parseFloat(newFortnightly.baseIncome) + parseFloat(newFortnightly.super);
  //GST
  newFortnightly.gst = parseFloat(newFortnightly.package) * parseFloat(GST);
  //Total
  newFortnightly.total =
    parseFloat(newFortnightly.package) + parseFloat(newFortnightly.gst);

  //===MONTHLY===
  //base income
  newMonthly.baseIncome = parseFloat((hourlyBase * 8 * 5 * 52) / 12);
  //super
  newMonthly.super = newMonthly.baseIncome * newSuperRate;
  //package
  newMonthly.package = parseFloat(newMonthly.baseIncome) + parseFloat(newMonthly.super);
  //GST
  newMonthly.gst = parseFloat(newMonthly.package) * parseFloat(GST);
  //Total
  newMonthly.total = parseFloat(newMonthly.package) + parseFloat(newMonthly.gst);

  //===YEARLY===
  //base income
  newYearly.baseIncome = parseFloat(
    hourlyBase * 8 * 5 * 52 * factorOfReductionByDaysOff
  );
  //super
  newYearly.super = newYearly.baseIncome * newSuperRate;
  //package
  newYearly.package = parseFloat(newYearly.baseIncome) + parseFloat(newYearly.super);
  //GST
  newYearly.gst = parseFloat(newYearly.package) * parseFloat(GST);
  //Total
  newYearly.total = parseFloat(newYearly.package) + parseFloat(newYearly.gst);

  //==============================================

  //calculate income tax [1] - with incomeTaxRate objects

  let taxBrackets = FYData[newYear].taxBrackets;

  let yearlyBase = newMonthly.baseIncome * 12;

  for (let i = 0; i < taxBrackets.length; i++) {
    const taxBracket = taxBrackets[i];
    if (
      yearlyBase > taxBracket.min &&
      (yearlyBase <= taxBracket.max || i === taxBrackets.length - 1)
    ) {
      newMonthly.incomeTax = (
        (taxBracket.flat +
          taxBracket.percent * (yearlyBase - taxBracket.over)) /
        12
      ).toFixed();
      break;
    }
  }

  //==============================================
  //calculate income tax [1] -- hardcoded tax rates
  // if (newMonthly.baseIncome * 12 < 18200) {
  //   newHourly.incomeTax = 0;
  //   newDaily.incomeTax = 0;
  //   newWeekly.incomeTax = 0;
  //   newFortnightly.incomeTax = 0;
  //   newMonthly.incomeTax = 0;
  //   newYearly.incomeTax = 0;
  // } else if (newMonthly.baseIncome * 12 > 18200 && newMonthly.baseIncome * 12 <= 45000) {
  //   newMonthly.incomeTax = (0.19 * (parseFloat(newMonthly.baseIncome) * 12 - 18200)) / 12;
  // } else if (newMonthly.baseIncome * 12 > 45000 && newMonthly.baseIncome * 12 <= 120000) {
  //   newMonthly.incomeTax =
  //     (5092 + 0.325 * (parseFloat(newMonthly.baseIncome) * 12 - 45000)) / 12;
  // } else if (newMonthly.baseIncome * 12 > 120000 && newMonthly.baseIncome * 12 <= 180000) {
  //   newMonthly.incomeTax = (
  //     (29467 + 0.37 * (parseFloat(newMonthly.baseIncome) * 12 - 120000)) /
  //     12
  //   ).toFixed();
  // } else if (newMonthly.baseIncome * 12 > 180000) {
  //   newMonthly.incomeTax = (
  //     (51667 + 0.45 * (parseFloat(newMonthly.baseIncome) * 12 - 180000)) /
  //     12
  //   ).toFixed();
  // }

  //==============================================

  newHourly.incomeTax = (parseFloat(newMonthly.incomeTax) * 12) / 52 / 5 / 8;
  newDaily.incomeTax = parseFloat(newHourly.incomeTax) * 8;
  newWeekly.incomeTax = parseFloat(newHourly.incomeTax) * 8 * 5;
  newFortnightly.incomeTax = parseFloat(newHourly.incomeTax) * 8 * 5 * 2;
  newMonthly.incomeTax = (parseFloat(newHourly.incomeTax) * 8 * 5 * 52) / 12;
  newYearly.incomeTax = parseFloat(newDaily.incomeTax) * 5 * 52 * factorOfReductionByDaysOff;

  //==============================================

  //calculate after-tax income [0]
  newHourly.afterTaxIncome = parseFloat(newHourly.baseIncome) - parseFloat(newHourly.incomeTax);
  newDaily.afterTaxIncome = parseFloat(newDaily.baseIncome) - parseFloat(newDaily.incomeTax);
  newWeekly.afterTaxIncome = parseFloat(newWeekly.baseIncome) - parseFloat(newWeekly.incomeTax);
  newFortnightly.afterTaxIncome =
    parseFloat(newFortnightly.baseIncome) - parseFloat(newFortnightly.incomeTax);
  newMonthly.afterTaxIncome = parseFloat(newMonthly.baseIncome) - parseFloat(newMonthly.incomeTax);
  newYearly.afterTaxIncome = parseFloat(newYearly.baseIncome) - parseFloat(newYearly.incomeTax);

  if (arrayName) {
    arrayGroup[arrayName][i] = enteredValue;
  }


  for (var key in newHourly){
    newHourly[key] = parseFloat(newHourly[key]).toFixed();
    newDaily[key] = parseFloat(newDaily[key]).toFixed();
    newWeekly[key] = parseFloat(newWeekly[key]).toFixed();
    newFortnightly[key] = parseFloat(newFortnightly[key]).toFixed();
    newMonthly[key] = parseFloat(newMonthly[key]).toFixed();
    newYearly[key] = parseFloat(newYearly[key]).toFixed();
  }

  setHourly(newHourly);
  setDaily(newDaily);
  setWeekly(newWeekly);
  setFortnightly(newFortnightly);
  setMonthly(newMonthly);
  setYearly(newYearly);
};

export default calculationFromBase;
