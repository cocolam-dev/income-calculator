import { useGlobalContext } from "./GlobalContext";
import calculationFromBase from "./calculationFromBase";
import { NumericFormat } from "react-number-format";

let hourlyBase = 0;
let newNumDayOff = 9;
let newSuperRate = 0.11;
let newIsContract = "True";

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
          <input
            defaultValue="11"
            onChange={(e) => {
              newSuperRate = e.target.value / 100;
              setSuperRate(newSuperRate);
              calculationFromBase(
                null,
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
          />
        </div>
      </form>

      <h5>Assumptions & Rates applied:</h5>
      <p className="SmallText">
        52 weeks in a year, 5 work days in a week, 8 hours in a day, total 260
        work days in a year
      </p>
      <p className="SmallText">
        Only Year row is adjusted by number of days off for contractors
      </p>
      <p className="SmallText">Country: Australia</p>
      <p className="SmallText">
        Financial Year for income tax calculation purpose: 2023-24
      </p>
      <p className="SmallText">GST: {GST * 100}%</p>

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
                value={hourly[0]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={hourly[1]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyBaseIncome">
              <NumericFormat
                type="text"
                value={hourly[2]}
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
                value={hourly[2]}
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
                value={hourly[3]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="hourlyPackage">
              <NumericFormat
                type="text"
                value={hourly[4]}
                thousandSeparator=","
                prefix={"$"}
                onValueChange={(values, sourceInfo) => {
                  const arrayName = "newHourly";
                  const i = 4;
                  const isEvent = sourceInfo.source === "event";
                  if (isEvent) {
                    const enteredValue = values.floatValue;
                    hourlyBase = values.floatValue / (1 + superRate);
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
            {/* <input
              //   key="hourlyPackage"
              //   name="hourlyPackage"
              //   value={hourly[4]}
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
                  value={hourly[5]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="hourlyTotal">
                <NumericFormat
                  type="text"
                  value={hourly[6]}
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
                  value={hourly[6]}
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
                value={daily[0]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="dailyIncomeTax">
              <NumericFormat
                displayType="text"
                value={daily[1]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="dailyBaseIncome">
              <NumericFormat
                type="text"
                value={daily[2]}
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
                value={daily[2]}
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
                value={daily[3]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="dailyPackage">
              <NumericFormat
                type="text"
                value={daily[4]}
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
                value={daily[4]}
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
                  value={daily[5]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="dailyTotal">
                <NumericFormat
                  type="text"
                  value={daily[6]}
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
                  value={daily[6]}
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
                value={weekly[0]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="weeklyIncomeTax">
              <NumericFormat
                displayType="text"
                value={weekly[1]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="weeklyBaseIncome">
              <NumericFormat
                type="text"
                value={weekly[2]}
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
                value={weekly[2]}
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
                value={weekly[3]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="weeklyPackage">
              <NumericFormat
                type="text"
                value={weekly[4]}
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
                value={weekly[4]}
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
                  value={weekly[5]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="weeklyTotal">
                <NumericFormat
                  type="text"
                  value={weekly[6]}
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
                  value={weekly[6]}
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
                value={fortnightly[0]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="fortnightlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={fortnightly[1]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="fortnightlyBaseIncome">
              <NumericFormat
                type="text"
                value={fortnightly[2]}
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
                value={fortnightly[2]}
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
                value={fortnightly[3]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="fortnightlyPackage">
              <NumericFormat
                type="text"
                value={fortnightly[4]}
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
                value={fortnightly[4]}
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
                  value={fortnightly[5]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td id="fortnightlyTotal">
                <NumericFormat
                  type="text"
                  value={fortnightly[6]}
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
                  value={fortnightly[6]}
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
                value={monthly[0]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="monthlyTax">
              <NumericFormat
                displayType="text"
                value={monthly[1]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="monthlyBaseIncome">
              <NumericFormat
                type="text"
                value={monthly[2]}
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
                value={monthly[2]}
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
                value={monthly[3]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="monthlyPackage">
              <NumericFormat
                type="text"
                value={monthly[4]}
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
                value={monthly[4]}
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
                  value={monthly[5]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}

            {newIsContract && (
              <td id="monthlyTotal">
                <NumericFormat
                  type="text"
                  value={monthly[6]}
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
                  value={monthly[6]}
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
                  <p className="SmallerText">(reduced by # of days off)</p>
                </>
              ) : (
                "Year"
              )}
            </td>
            <td id="yearlyAfterTaxIncome">
              <NumericFormat
                displayType="text"
                value={yearly[0]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            <td id="yearlyIncomeTax">
              <NumericFormat
                displayType="text"
                value={yearly[1]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            {newIsContract ? (
              <td>
                <NumericFormat
                  displayType="text"
                  value={yearly[2]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            ) : (
              <td id="yearlyBaseIncome">
                <NumericFormat
                  type="text"
                  value={yearly[2]}
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
                  value={yearly[2]}
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
                value={yearly[3]}
                thousandSeparator=","
                prefix={"$"}
              />
            </td>
            {newIsContract ? (
              <td>
                <NumericFormat
                  displayType="text"
                  value={yearly[4]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            ) : (
              <td id="yearlyPackage">
                <NumericFormat
                  type="text"
                  value={yearly[4]}
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
                  value={yearly[4]}
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
                  value={yearly[5]}
                  thousandSeparator=","
                  prefix={"$"}
                />
              </td>
            )}
            {newIsContract && (
              <td>
                <NumericFormat
                  displayType="text"
                  value={yearly[6]}
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
