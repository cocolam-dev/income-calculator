import { useEffect } from "react";
import { useGlobalContext } from "./GlobalContext";
import FYData from "./FYData";

const Form = () => {
  const {
    year,
    setYear,
    superRate,
    setSuperRate,
    GST,
    medicareLevy,
    setMedicareLevy,
    numDayOff,
    setNumDayOff,
    isContract,
    setIsContract,
  } = useGlobalContext();

  // Update the super rate and medicare levy displayed whenever the FY selection is changed
  useEffect(() => {
    setSuperRate(FYData[year].superRate);
    setMedicareLevy(FYData[year].medicareLevy);
  }, [year, setSuperRate, setMedicareLevy]);

  return (
    <>
      <form className="AdjustmentForm">
        <div className="AdjustmentFormField">
          <label>Type of Employment</label>
          <select
            onChange={(e) => {
              if (e.target.value === "Contract") {
                setIsContract(true);
              } else {
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
                setNumDayOff(e.target.value);
                console.log(numDayOff);
              }}
            />
          </div>
        )}
        <div className="AdjustmentFormField">
          <label>Financial year (for income tax purpose)</label>
          <select
            onChange={(e) => {
              if (e.target.value === "FY2023-24 (1 July 23 - 30 June 24)") {
                setYear("FY2324");
              } else if (
                e.target.value === "FY2024-25 (1 July 24 - 30 June 25)"
              ) {
                setYear("FY2425");
              }
            }}
          >
            <option>FY2024-25 (1 July 24 - 30 June 25)</option>
            <option>FY2023-24 (1 July 23 - 30 June 24)</option>
          </select>
        </div>
        <div className="AdjustmentFormField">
          <label>Superannuation rate (%)</label>

          <p>{superRate * 100} %</p>
        </div>
      </form>
      <section className="assumptions">
        <h5>Assumptions & Rates applied:</h5>
        <p className="SmallText">
          52 weeks in a year, 5 work days in a week, 8 work hours in a day,
          total 260 work days in a year
        </p>
        <p className="SmallText">
          For contractors, only the Year row is adjusted by number of days off
        </p>
        <p className="SmallText">Country: Australia</p>
        <p className="SmallText">
          Financial Year for income tax calculation purpose: {year}
        </p>
        <p className="SmallText">GST: {GST * 100}%</p>
        <p className="SmallText">Medicare Levy: {medicareLevy * 100}%</p>
        <p className="SmallText">
          Medicare Levy Surcharge (MLS) is NOT included in this calculator
        </p>
        <p className="SmallText">Super guarantee:</p>
        <p className="SmallText"> - FY2324: 11%</p>
        <p className="SmallText"> - FY2425: 11.5%</p>
      </section>
    </>
  );
};

export default Form;
