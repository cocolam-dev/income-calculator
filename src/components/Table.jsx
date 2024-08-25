import FYData from "./FYData";
import { useGlobalContext } from "./GlobalContext";
import calculationFromBase from "./CalculationFromBase";
import { NumericFormat } from "react-number-format";

let hourlyBase = 0;
let newNumDayOff = 9;
let newSuperRate = 0.115;
let newIsContract = "True";
let newYear = "FY2425";

const Table = () => {
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

  return (
    <>
      <form className="AdjustmentForm">
        <div className="AdjustmentFormField">
          <label>Type of Employment</label>
          <select
            onChange={(e) => {
              if (e.target.value === "Contract") {
                newIsContract = true;
                setIsContract(true);
              } else {
                newIsContract = false;
                setIsContract(false);
              }
            }}
          >
            <option>Contract</option>
            <option>Permanent, ongoing, full-time</option>
          </select>
        </div>
        {isContract && (
          <div className="AdjustmentFormField">
            <label>
              Number of days off in the year (include public holidays)
            </label>
            <input
              defaultValue="9"
              onChange={(e) => {
                newNumDayOff = e.target.value;
                setNumDayOff(newNumDayOff);
                calculationFromBase(
                  null,
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
                  isContract
                );
              }}
            />
          </div>
        )}
        <div className="AdjustmentFormField">
          <label>Superannuation rate (%)</label>
          {/* <input
            defaultValue="11.5"
            value={newSuperRate * 100}
            onChange={(e) => {
              newSuperRate = e.target.value / 100;
              setSuperRate(newSuperRate);
              calculationFromBase(
                null,
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
                isContract
              );
            }}
          /> */}

          <p>{newSuperRate * 100}%</p>
        </div>
        <div className="AdjustmentFormField">
          <label>Financial year (for income tax purpose)</label>
          <select
            onChange={(e) => {
              if (e.target.value === "FY2023-24 (1 July 23 - 30 June 24)") {
                newYear = "FY2324";
                setYear("FY2324");
                newSuperRate = FYData[newYear].superRate;
                setSuperRate(newSuperRate);
                calculationFromBase(
                  null,
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
                  isContract
                );
              } else if (
                e.target.value === "FY2024-25 (1 July 24 - 30 June 25)"
              ) {
                newYear = "FY2425";
                setYear("FY2425");
                newSuperRate = FYData[newYear].superRate;
                setSuperRate(newSuperRate);
                calculationFromBase(
                  null,
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
                  isContract
                );
              }
            }}
          >
            <option>FY2024-25 (1 July 24 - 30 June 25)</option>
            <option>FY2023-24 (1 July 23 - 30 June 24)</option>
          </select>
        </div>
      </form>

      <h5>Assumptions & Rates applied:</h5>
      <p className="SmallText">
        52 weeks in a year, 5 work days in a week, 8 work hours in a day, total
        260 work days in a year
      </p>
      <p className="SmallText">
        Only Year row is adjusted by number of days off for contractors
      </p>
      <p className="SmallText">Country: Australia</p>
      <p className="SmallText">
        Financial Year for income tax calculation purpose: {newYear}
      </p>
      <p className="SmallText">GST: {GST * 100}%</p>
      <p className="SmallText">Super guarantee:</p>
      <p className="SmallText"> - FY2324: 11%</p>
      <p className="SmallText"> - FY2425: 11.5%</p>

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
              {/* <input
                key="hourlyBaseIncome"
                name="hourlyBaseIncome"
                value={hourly.baseIncome}
                onChange={(e) => {
                  hourlyBase = e.target.value;
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
            {/* <input
              //   key="hourlyPackage"
              //   name="hourlyPackage"
              //   value={hourly.package}
              //   onChange={(e) => {
              //     hourlyBase = e.target.value / (1 + superRate);
              //     CalculationFromBase(
              //       newSuperRate,
              //       newNumDayOff,
              //       hourlyBase,
              //       setHourly,
              //       setDaily,
              //       setWeekly,
              //       setFortnightly,
              //       setMonthly,
              //       setYearly,
              //       GST,
              //       isContract
              //     );
              //   }}
              // /> */}
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
                {/* <input
                  value={hourly.total}
                  onChange={(e) => {
                    hourlyBase = e.target.value / (1 + GST) / (1 + superRate);
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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
              {/* <input
                key="dailyBaseIncome"
                name="dailyBaseIncome"
                value={daily.baseIncome}
                onChange={(e) => {
                  hourlyBase = e.target.value / 8;
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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

              {/* <input
                key="dailyPackage"
                name="dailyPackage"
                value={daily.package}
                onChange={(e) => {
                  hourlyBase = e.target.value / 8 / (1 + superRate);
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
                {/* <input
                  value={daily.total}
                  onChange={(e) => {
                    hourlyBase =
                      e.target.value / 8 / (1 + GST) / (1 + superRate);
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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

              {/* <input
                key="weeklyBaseIncome"
                name="weeklyBaseIncome"
                value={weekly.baseIncome}
                onChange={(e) => {
                  hourlyBase = e.target.value / 5 / 8;
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
              {/* <input
                key="weeklyPackage"
                name="weeklyPackage"
                value={weekly.package}
                onChange={(e) => {
                  hourlyBase = e.target.value / 5 / 8 / (1 + superRate);
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
                {/* <input
                  key="weeklyTotal"
                  name="weeklyTotal"
                  value={weekly.total}
                  onChange={(e) => {
                    hourlyBase =
                      e.target.value / 5 / 8 / (1 + GST) / (1 + superRate);
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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

              {/* <input
                key="fortnightlyBaseIncome"
                name="fortnightlyBaseIncome"
                value={fortnightly.baseIncome}
                onChange={(e) => {
                  hourlyBase = e.target.value / 2 / 5 / 8;
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
              {/* <input
                key="fortnightlyPackage"
                name="fortnightlyPackage"
                value={fortnightly.package}
                onChange={(e) => {
                  hourlyBase = e.target.value / 2 / 5 / 8 / (1 + superRate);
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
                {/* <input
                  key="fortnightlyTotal"
                  name="fortnightlyTotal"
                  value={fortnightly.total}
                  onChange={(e) => {
                    hourlyBase =
                      e.target.value / 2 / 5 / 8 / (1 + GST) / (1 + superRate);
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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
              {/* <input
                key="monthlyBaseIncome"
                name="monthlyBaseIncome"
                value={monthly.baseIncome}
                onChange={(e) => {
                  hourlyBase = (e.target.value * 12) / 52 / 5 / 8;
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
              {/* <input
                key="monthlyPackage"
                name="monthlyPackage"
                value={monthly.package}
                onChange={(e) => {
                  hourlyBase =
                    (e.target.value * 12) / 52 / 5 / 8 / (1 + superRate);
                  CalculationFromBase(
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
                    isContract
                  );
                }}
              /> */}
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
                {/* <input
                  key="monthlyTotal"
                  name="monthlyTotal"
                  value={monthly.total}
                  onChange={(e) => {
                    hourlyBase =
                      (e.target.value * 12) /
                      52 /
                      5 /
                      8 /
                      (1 + GST) /
                      (1 + superRate);
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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
                {/* <input
                  key="yearlyBaseIncome"
                  name="yearlyBaseIncome"
                  value={yearly.baseIncome}
                  onChange={(e) => {
                    hourlyBase = e.target.value / 52 / 5 / 8;
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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
                {/* <input
                  key="yearlyPackage"
                  name="yearlyPackage"
                  value={yearly.package}
                  onChange={(e) => {
                    hourlyBase = e.target.value / 52 / 5 / 8 / (1 + superRate);
                    CalculationFromBase(
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
                      isContract
                    );
                  }}
                /> */}
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
export default Table;
