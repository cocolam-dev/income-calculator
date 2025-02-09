import FYData from "./FYData";
import { useEffect } from "react";
import { useGlobalContext } from "./GlobalContext";

// const calculationFromBase = (
//   enteredValue,
//   newSuperRate,
//   newNumDayOff,
//   newYear,
//   hourlyBase,
//   setHourly,
//   setDaily,
//   setWeekly,
//   setFortnightly,
//   setMonthly,
//   setYearly,
//   GST,
//   isContract,
//   arrayName,
//   i
// ) => {
//   let newHourly = {};
//   let newDaily = {};
//   let newWeekly = {};
//   let newFortnightly = {};
//   let newMonthly = {};
//   let newYearly = {};
//   let arrayGroup = {
//     newHourly,
//     newDaily,
//     newWeekly,
//     newFortnightly,
//     newMonthly,
//     newYearly,
//   };

const CalculationFromBase = () => {
  const {
    hourly,
    setHourly,
    daily,
    setDaily,
    weekly,
    setWeekly,
    fortnightly,
    setFortnightly,
    monthly,
    setMonthly,
    yearly,
    setYearly,
    year,
    setYear,
    superRate,
    setSuperRate,
    GST,
    setGST,
    numDayOff,
    setNumDayOff,
    isContract,
    setIsContract,
  } = useGlobalContext();

  let hourlyBase = 0;

  let factorOfReductionByDaysOff = 0;

  isContract && hourlyBase > 0
    ? (factorOfReductionByDaysOff = 1 - newNumDayOff / 260)
    : (factorOfReductionByDaysOff = 1);

  //===HOURLY===
  //calculate new hourly base income
  newHourly.baseIncome = parseFloat(hourlyBase);
  //calculate new hourly super
  newHourly.super = parseFloat(hourlyBase) * newSuperRate;
  //calculate new hourly package
  newHourly.package =
    parseFloat(newHourly.baseIncome) + parseFloat(newHourly.super);
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
  newDaily.package =
    parseFloat(newDaily.baseIncome) + parseFloat(newDaily.super);
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
  newWeekly.package =
    parseFloat(newWeekly.baseIncome) + parseFloat(newWeekly.super);
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
  newMonthly.package =
    parseFloat(newMonthly.baseIncome) + parseFloat(newMonthly.super);
  //GST
  newMonthly.gst = parseFloat(newMonthly.package) * parseFloat(GST);
  //Total
  newMonthly.total =
    parseFloat(newMonthly.package) + parseFloat(newMonthly.gst);

  //===YEARLY===
  //base income
  newYearly.baseIncome = parseFloat(
    hourlyBase * 8 * 5 * 52 * factorOfReductionByDaysOff
  );
  //super
  newYearly.super = newYearly.baseIncome * newSuperRate;
  //package
  newYearly.package =
    parseFloat(newYearly.baseIncome) + parseFloat(newYearly.super);
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
  newYearly.incomeTax =
    parseFloat(newDaily.incomeTax) * 5 * 52 * factorOfReductionByDaysOff;

  //==============================================

  //calculate after-tax income [0]
  newHourly.afterTaxIncome =
    parseFloat(newHourly.baseIncome) - parseFloat(newHourly.incomeTax);
  newDaily.afterTaxIncome =
    parseFloat(newDaily.baseIncome) - parseFloat(newDaily.incomeTax);
  newWeekly.afterTaxIncome =
    parseFloat(newWeekly.baseIncome) - parseFloat(newWeekly.incomeTax);
  newFortnightly.afterTaxIncome =
    parseFloat(newFortnightly.baseIncome) -
    parseFloat(newFortnightly.incomeTax);
  newMonthly.afterTaxIncome =
    parseFloat(newMonthly.baseIncome) - parseFloat(newMonthly.incomeTax);
  newYearly.afterTaxIncome =
    parseFloat(newYearly.baseIncome) - parseFloat(newYearly.incomeTax);

  if (arrayName) {
    arrayGroup[arrayName][i] = enteredValue;
  }

  for (var key in newHourly) {
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

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th title="What you get to keep">After-tax income</th>
            <th>Income Tax</th>
            <th title="Before-tax income">Base</th>
            <th>Super</th>
            <th title="Base income + super">Package</th>
            {newIsContract && <th title="relevant for contractors">GST</th>}
            {newIsContract && (
              <th title="package + GST, relevant for contractors">Total</th>
            )}
          </tr>
          <tr>
            <td></td>
            <td className="SmallerText">What you get to keep</td>
            <td></td>
            <td className="SmallerText">Before tax income</td>
            <td></td>
            <td className="SmallerText">Base + super</td>
            {newIsContract && (
              <td className="SmallerText">GST - contractors only</td>
            )}
            {newIsContract && (
              <td className="SmallerText">Package + GST - contractors only</td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Hour</td>
            <td id="hourlyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={hourly.afterTaxIncome}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={hourly.incomeTax}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyBaseIncome">
              <NumericFormat
                type="text"
                value={hourly.baseIncome}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const enteredValue = values.floatValue;
                  const arrayName = "newHourly";
                  const i = 2;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    hourlyBase = values.floatValue;
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            <td id="hourlySuper">
              <NumericFormat
                displayType="text"
                value={hourly.super}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyPackage">
              <NumericFormat
                type="text"
                value={hourly.package}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newHourly";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / (1 + newSuperRate);
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>

            {newIsContract && (
              <td id="hourlyGST">
                <NumericFormat
                  displayType="text"
                  value={hourly.gst}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="hourlyTotal">
                <NumericFormat
                  type="text"
                  value={hourly.total}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newHourly";
                    const i = 6;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        values.floatValue / (1 + GST) / (1 + newSuperRate);
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Day</td>
            <td id="dailyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={daily.afterTaxIncome}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="dailyIncomeTax">
              <NumericFormat
                displayType="text"
                value={daily.incomeTax}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="dailyBaseIncome">
              <NumericFormat
                type="text"
                value={daily.baseIncome}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newDaily";
                  const i = 2;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / 8;
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            <td id="dailySuper">
              <NumericFormat
                displayType="text"
                value={daily.super}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="dailyPackage">
              <NumericFormat
                type="text"
                value={daily.package}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newDaily";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / 8 / (1 + superRate);
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            {newIsContract && (
              <td id="dailyGST">
                <NumericFormat
                  displayType="text"
                  value={daily.gst}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="dailyTotal">
                <NumericFormat
                  type="text"
                  value={daily.total}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newDaily";
                    const i = 6;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        values.floatValue / 8 / (1 + GST) / (1 + superRate);
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Week</td>
            <td id="weeklyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={weekly.afterTaxIncome}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="weeklyIncomeTax">
              <NumericFormat
                displayType="text"
                value={weekly.incomeTax}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="weeklyBaseIncome">
              <NumericFormat
                type="text"
                value={weekly.baseIncome}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newWeekly";
                  const i = 2;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / 5 / 8;
                    calculationFromBase(
                      enteredValue,
                      newSuperRate,
                      newNumDayOff,
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
                    );
                  }
                }}
              />
            </td>
            <td id="weeklySuper">
              <NumericFormat
                displayType="text"
                value={weekly.super}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="weeklyPackage">
              <NumericFormat
                type="text"
                value={weekly.package}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newWeekly";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / 5 / 8 / (1 + superRate);
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            {newIsContract && (
              <td id="weeklyGST">
                <NumericFormat
                  displayType="text"
                  value={weekly.gst}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="weeklyTotal">
                <NumericFormat
                  type="text"
                  value={weekly.total}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newWeekly";
                    const i = 6;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        values.floatValue / 5 / 8 / (1 + GST) / (1 + superRate);
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Fortnight</td>
            <td id="fortnightlyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={fortnightly.afterTaxIncome}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="fortnightlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={fortnightly.incomeTax}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="fortnightlyBaseIncome">
              <NumericFormat
                type="text"
                value={fortnightly.baseIncome}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newFortnightly";
                  const i = 2;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / 2 / 5 / 8;
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            <td id="fortnightlySuper">
              <NumericFormat
                displayType="text"
                value={fortnightly.super}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="fortnightlyPackage">
              <NumericFormat
                type="text"
                value={fortnightly.package}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newFortnightly";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase =
                      values.floatValue / 2 / 5 / 8 / (1 + superRate);
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            {newIsContract && (
              <td id="fortnightlyGST">
                <NumericFormat
                  displayType="text"
                  value={fortnightly.gst}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="fortnightlyTotal">
                <NumericFormat
                  type="text"
                  value={fortnightly.total}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newFortnightly";
                    const i = 6;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        values.floatValue /
                        2 /
                        5 /
                        8 /
                        (1 + GST) /
                        (1 + superRate);
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Month</td>
            <td id="monthlyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={monthly.afterTaxIncome}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="monthlyTax">
              <NumericFormat
                displayType="text"
                value={monthly.incomeTax}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="monthlyBaseIncome">
              <NumericFormat
                type="text"
                value={monthly.baseIncome}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newMonthly";
                  const i = 2;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = (values.floatValue * 12) / 52 / 5 / 8;
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            <td id="monthlySuper">
              <NumericFormat
                displayType="text"
                value={monthly.super}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="monthlyPackage">
              <NumericFormat
                type="text"
                value={monthly.package}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newMonthly";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase =
                      (values.floatValue * 12) / 52 / 5 / 8 / (1 + superRate);
                    calculationFromBase(
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
                    );
                  }
                }}
              />
            </td>
            {newIsContract && (
              <td id="monthlyGST">
                <NumericFormat
                  displayType="text"
                  value={monthly.gst}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}

            {newIsContract && (
              <td id="monthlyTotal">
                <NumericFormat
                  type="text"
                  value={monthly.total}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newMonthly";
                    const i = 6;

                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        (values.floatValue * 12) /
                        52 /
                        5 /
                        8 /
                        (1 + GST) /
                        (1 + superRate);
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">
              {newIsContract ? (
                <>
                  Year <br />{" "}
                  <p className="SmallerText">
                    (Only year row is reduced by # of days off)
                  </p>
                </>
              ) : (
                "Year"
              )}
            </td>
            <td id="yearlyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={yearly.afterTaxIncome}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="yearlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={yearly.incomeTax}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            {newIsContract ? (
              <td>
                <NumericFormat
                  displayType="text"
                  value={yearly.baseIncome}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            ) : (
              <td id="yearlyBaseIncome">
                <NumericFormat
                  type="text"
                  value={yearly.baseIncome}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newYearly";
                    const i = 2;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase = values.floatValue / 52 / 5 / 8;
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
            <td id="yearlySuper">
              <NumericFormat
                displayType="text"
                value={yearly.super}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            {newIsContract ? (
              <td>
                <NumericFormat
                  displayType="text"
                  value={yearly.package}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            ) : (
              <td id="yearlyPackage">
                <NumericFormat
                  type="text"
                  value={yearly.package}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newYearly";
                    const i = 4;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        values.floatValue / 52 / 5 / 8 / (1 + superRate);
                      calculationFromBase(
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
                      );
                    }
                  }}
                />
              </td>
            )}
            {newIsContract && (
              <td id="yearlyGST">
                <NumericFormat
                  displayType="text"
                  value={yearly.gst}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td>
                <NumericFormat
                  displayType="text"
                  value={yearly.total}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CalculationFromBase;
