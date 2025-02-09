import FYData from "./FYData";
import { useGlobalContext } from "./GlobalContext";
import CalculationFromBase from "./CalculationFromBase";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";

const TableOld = () => {
  const {
    base,
    setBase,
    superAmt,
    setSuperAmt,
    packageAmt,
    setPackageAmt,
    gstAmt,
    setGstAmt,
    total,
    setTotal,
    incomeTax,
    setIncomeTax,
    afterTaxIncome,
    setAfterTaxIncome,
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

  let factorOfReductionByDaysOff = 0;

  isContract && base.hourly > 0
    ? (factorOfReductionByDaysOff = 1 - numDayOff / 260)
    : (factorOfReductionByDaysOff = 1);

  let hourlyBase = 0;

  // useEffect(() => {
  //   //===HOURLY===
  //   //calculate new hourly base income
  //   // base.hourly = parseFloat(hourlyBase);
  //   //calculate new hourly super
  //   superAmt.hourly = (parseFloat(hourlyBase) * superRate).toFixed(2);

  //   //calculate new hourly package
  //   packageAmt.hourly = (
  //     parseFloat(base.hourly) + parseFloat(superAmt.hourly)
  //   ).toFixed(2);
  //   //calculate new hourly GST
  //   gstAmt.hourly = (parseFloat(packageAmt.hourly) * parseFloat(GST)).toFixed(
  //     2
  //   );
  //   //calculate new hourly total
  //   total.hourly = (
  //     parseFloat(packageAmt.hourly) + parseFloat(gstAmt.hourly)
  //   ).toFixed(2);
  // }, [
  //   hourlyBase,
  //   GST,
  //   base,
  //   superAmt,
  //   packageAmt,
  //   gstAmt,
  //   total,
  //   superRate,
  //   setBase,
  //   setSuperRate,
  // ]);

  useEffect(() => {
    let newSuperAmtHourly = (parseFloat(base.hourly) * superRate).toFixed(2);
    setSuperAmt({ hourly: newSuperAmtHourly });

    let newPackageAmtHourly = (
      parseFloat(base.hourly) + parseFloat(newSuperAmtHourly)
    ).toFixed(2);
    setPackageAmt({ hourly: newPackageAmtHourly });

    let newGstAmtHourly = (
      parseFloat(newPackageAmtHourly) * parseFloat(GST)
    ).toFixed(2);
    setGstAmt({ hourly: newGstAmtHourly });

    let newTotalHourly = (
      parseFloat(newPackageAmtHourly) + parseFloat(newGstAmtHourly)
    ).toFixed(2);
    setTotal({ hourly: newTotalHourly });

    //calculate income tax
    let taxBrackets = FYData[year].taxBrackets;

    let yearlyBase = base.hourly * 8 * 260;

    for (let i = 0; i < taxBrackets.length; i++) {
      const taxBracket = taxBrackets[i];
      if (
        yearlyBase > taxBracket.min &&
        (yearlyBase <= taxBracket.max || i === taxBrackets.length - 1)
      ) {
        let newIncomeTaxHourly = (
          (taxBracket.flat +
            taxBracket.percent * (yearlyBase - taxBracket.over)) /
          260 /
          8
        ).toFixed();
        setIncomeTax({ hourly: newIncomeTaxHourly });

        //calculate after-tax income
        let afterTaxIncomeHourly = base.hourly - newIncomeTaxHourly;
        setAfterTaxIncome({ hourly: afterTaxIncomeHourly });
        break;
      }
    }
  }, [hourlyBase, superRate, base, setBase]);

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
            {isContract && <th title="relevant for contractors">GST</th>}
            {isContract && (
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
            {isContract && (
              <td className="SmallerText">GST - contractors only</td>
            )}
            {isContract && (
              <td className="SmallerText">Package + GST - contractors only</td>
            )}
          </tr>

          <tr>
            <td className="RowHeader">Hour</td>
            <td id="hourlyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={afterTaxIncome.hourly}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={incomeTax.hourly}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyBaseIncome">
              <NumericFormat
                type="text"
                value={base.hourly}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const enteredValue = values.floatValue;
                  const arrayName = "newHourly";
                  const i = 2;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    hourlyBase = values.floatValue;

                    setBase({ hourly: hourlyBase });
                  }
                }}
              />
            </td>
            <td id="hourlySuper">
              <NumericFormat
                displayType="text"
                value={superAmt.hourly}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyPackage">
              <NumericFormat
                type="text"
                value={packageAmt.hourly}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newHourly";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / (1 + superRate);
                    setBase({ hourly: hourlyBase });
                  }
                }}
              />
            </td>

            {isContract && (
              <td id="hourlyGST">
                <NumericFormat
                  displayType="text"
                  value={gstAmt.hourly}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {isContract && (
              <td id="hourlyTotal">
                <NumericFormat
                  type="text"
                  value={total.hourly}
                  thousandSeparator=","
                  prefix={"$"}
                  onValueChange={(values, sourceInfo) => {
                    const arrayName = "newHourly";
                    const i = 6;
                    const isEvent = sourceInfo.source === "event";
                    if (isEvent) {
                      const enteredValue = values.floatValue;
                      hourlyBase =
                        values.floatValue / (1 + GST) / (1 + superRate);
                      setBase({ hourly: hourlyBase });
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
      <p className="SmallerText">
        This is an estimate only, we cannot guarantee its accuracy.
      </p>
    </>
  );
};
export default TableOld;
