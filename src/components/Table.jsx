import { useGlobalContext } from "./GlobalContext";
import CalculationFromBase from "./CalculationFromBase";

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
            <td className="SmallerText">GST - contractors only</td>
            <td className="SmallerText">Package + GST - contractors only</td>
          </tr>
          <tr>
            <td className="RowHeader">Hour</td>
            <td id="hourlyAfterTaxIncome">{hourly[0]}</td>
            <td id="hourlyIncomeTax">{hourly[1]}</td>
            <td id="hourlyBaseIncome">
              <input
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
              />
            </td>
            <td id="hourlySuper">{hourly[3]}</td>
            <td id="hourlyPackage">
              <input
                key="hourlyPackage"
                name="hourlyPackage"
                value={hourly[4]}
                onChange={(e) => {
                  hourlyBase = e.target.value / (1 + superRate);
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
              />
            </td>
            {newIsContract && <td id="hourlyGST">{hourly[5]}</td>}
            {newIsContract && (
              <td id="hourlyTotal">
                <input
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
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Day</td>
            <td id="dailyAfterTaxIncome">{daily[0]}</td>
            <td id="dailyIncomeTax">{daily[1]}</td>
            <td id="dailyBaseIncome">
              <input
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
              />
            </td>
            <td id="dailySuper">{daily[3]}</td>
            <td id="dailyPackage">
              <input
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
              />
            </td>
            {newIsContract && <td id="dailyGST">{daily[5]}</td>}
            {newIsContract && (
              <td id="dailyTotal">
                <input
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
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Week</td>
            <td id="weeklyAfterTaxIncome">{weekly[0]}</td>
            <td id="weeklyIncomeTax">{weekly[1]}</td>
            <td id="weeklyBaseIncome">
              <input
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
              />
            </td>
            <td id="weeklySuper">{weekly[3]}</td>
            <td id="weeklyPackage">
              <input
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
              />
            </td>
            {newIsContract && <td id="weeklyGST">{weekly[5]}</td>}
            {newIsContract && (
              <td id="weeklyTotal">
                <input
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
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Fortnight</td>
            <td id="fortnightlyAfterTaxIncome">{fortnightly[0]}</td>
            <td id="fortnightlyIncomeTax">{fortnightly[1]}</td>
            <td id="fortnightlyBaseIncome">
              <input
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
              />
            </td>
            <td id="fortnightlySuper">{fortnightly[3]}</td>
            <td id="fortnightlyPackage">
              <input
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
              />
            </td>
            {newIsContract && <td id="fortnightlyGST">{fortnightly[5]}</td>}
            {newIsContract && (
              <td id="fortnightlyTotal">
                <input
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
                />
              </td>
            )}
          </tr>
          <tr>
            <td className="RowHeader">Month</td>
            <td id="monthlyAfterTaxIncome">{monthly[0]}</td>
            <td id="monthlyTax">{monthly[1]}</td>
            <td id="monthlyBaseIncome">
              <input
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
              />
            </td>
            <td id="monthlySuper">{monthly[3]}</td>
            <td id="monthlyPackage">
              <input
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
              />
            </td>
            {newIsContract && <td id="monthlyGST">{monthly[5]}</td>}

            {newIsContract && (
              <td id="monthlyTotal">
                <input
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
                />
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
            <td id="yearlyAfterTaxIncome">{yearly[0]}</td>
            <td id="yearlyIncomeTax">{yearly[1]}</td>
            {newIsContract ? (
              <td>{yearly[2]}</td>
            ) : (
              <td id="yearlyBaseIncome">
                <input
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
                />
              </td>
            )}
            <td id="yearlySuper">{yearly[3]}</td>
            {newIsContract ? (
              <td>{yearly[4]}</td>
            ) : (
              <td id="yearlyPackage">
                <input
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
                />
              </td>
            )}
            {newIsContract && <td id="yearlyGST">{yearly[5]}</td>}
            {newIsContract && <td>{yearly[6]}</td>}
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
